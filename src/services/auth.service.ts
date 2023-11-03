import { hash, compare } from 'bcrypt';
import { sign } from 'jsonwebtoken';
import { Service } from 'typedi';
import { SECRET_KEY } from '@config';
import pg from '@database';
import { HttpException } from '@exceptions/httpException';
import { DataStoredInToken, TokenData } from '@interfaces/auth.interface';
import { Customer, CustomerLogin } from '@interfaces/customers.interface';
import { Merchant } from '@interfaces/merchant.interface';
import { RedisClient } from '@/database/redis';
import moment from 'moment';
import bcrypt from 'bcrypt';
import { CustomError } from '@exceptions/CustomError';
import { MailSendingService } from '@services/mailSending.service';

const createToken = (customer: Customer): TokenData => {
  const dataStoredInToken: DataStoredInToken = { id: customer.id };
  const expiresIn = '1h';

  return { expiresIn, token: sign(dataStoredInToken, SECRET_KEY, { expiresIn }) };
};
const createTokenMerchant = (merchant: Merchant): TokenData => {
  const dataStoredInToken: DataStoredInToken = { id: merchant.id, role: 'Merchant' };
  const expiresIn = '1h';

  return { expiresIn, token: sign(dataStoredInToken, SECRET_KEY, { expiresIn }) };
};
@Service()
export class AuthService {
  private redis: RedisClient;
  constructor() {
    this.redis = new RedisClient();
  }
  public async signup(customerData: Customer, trust: boolean, uid?: string): Promise<{ customer: Customer; token: string }> {
    const { name, phone, password } = customerData;
    const { rows: findCustomer } = await pg.query(
      `
        SELECT EXISTS(
                 SELECT "phone"
                 FROM customer
                 WHERE "phone" = $1
                 )`,
      [phone],
    );
    if (findCustomer[0].exists) throw new CustomError('NUMBER_TAKEN');

    const hashedPassword = await hash(password, 10);
    const { rows: signUpCustomerData } = await pg.query(
      `
        INSERT INTO customer("name",
                             "phone",
                             "hashed_password")
        VALUES ($1, $2, $3)
        RETURNING "id",phone,hashed_password
      `,
      [name, phone, hashedPassword],
    );
    if (uid && trust) {
      console.log(uid);
      await pg.query(
        `INSERT INTO customer_device(customer_id, device_id)
         values ($1, $2)`,
        [signUpCustomerData[0].id, uid],
      );
    }
    const tokenData = createToken(signUpCustomerData[0]);
    const token = tokenData.token;
    return { customer: signUpCustomerData[0], token };
  }

  public async login(CustomerData: CustomerLogin, deviceId: any): Promise<{ tokenData: TokenData; findCustomer: any }> {
    let customerStatus: { is_blocked?: boolean; last_login_attempt?: moment.Moment | null; safe_login_after?: number | null } = {};

    const { phone, password, trust, otp } = CustomerData;
    const newTrust = trust || false;

    const { rows, rowCount } = await pg.query(
      `
        SELECT "id",
               "phone",
               "hashed_password"
        FROM customer
        WHERE "phone" = $1
      `,
      [phone],
    );

    if (!rowCount) {
      throw new CustomError('USER_NOT_FOUND');
    }
    const status_object = JSON.stringify({ phone, deviceId });
    const customerStatusResult = await this.redis.hGet('customer_status', status_object);

    if (customerStatusResult) {
      customerStatus = JSON.parse(customerStatusResult);

      if (customerStatus.is_blocked) {
        const unBlockTime = moment(customerStatus.last_login_attempt).add(1, 'minute');

        if (moment().isBefore(unBlockTime)) {
          const timeLeft = unBlockTime.diff(moment(), 'seconds');
          throw new CustomError('USER_BLOCKED', null, timeLeft);
        }

        customerStatus.is_blocked = false;
        customerStatus.last_login_attempt = null; // Set to null since it's not a Moment object anymore
      }
    }

    const deviceResult = await pg.query(`Select * from customer_device where device_id= $1 and customer_id = $2`, [deviceId, rows[0].id]);

    const loginType = deviceResult.rows.length > 0 ? 'otp' : 'password';

    if (loginType === 'password') {
      const isCorrect = bcrypt.compareSync(password, rows[0].hashed_password);

      if (!isCorrect) {
        if (
          customerStatus.last_login_attempt &&
          moment().isBefore(moment(customerStatus.last_login_attempt).add(customerStatus.safe_login_after, 'seconds'))
        ) {
          customerStatus.is_blocked = true;
          customerStatus.safe_login_after = 0;
        } else {
          customerStatus.safe_login_after = customerStatus.last_login_attempt
            ? Math.max(60 - moment().diff(customerStatus.last_login_attempt, 'seconds'), 0)
            : 0;
        }
        customerStatus.last_login_attempt = moment();
        const status_object = JSON.stringify({ phone, deviceId });
        await this.redis.hSet('customer_status', status_object, JSON.stringify(customerStatus));

        if (customerStatus.is_blocked) {
          throw new CustomError('USER_BLOCKED');
        } else {
          throw new CustomError('WRONG_PASSWORD');
        }
      }
    } else {
      const redisOtp = await this.redis.hGet('otp', phone);

      if (!redisOtp) {
        return;
      }

      const otpObject = JSON.parse(redisOtp);

      if (moment().isAfter(otpObject.expiresAt)) {
        await this.redis.hDel('otp', phone);
        throw new CustomError('EXPIRED_OTP');
      }

      if (otpObject.code === parseInt(otp) && moment().isBefore(otpObject.expiresAt)) {
        await this.redis.hDel('otp', phone);
      } else {
        return;
      }
    }

    if (newTrust) {
      await pg.query(`Insert into customer_device(customer_id, device_id) values ($1,$2)`, [rows[0].id, deviceId]);
    }

    const tokenData: TokenData = createToken(rows[0]);
    return { tokenData, findCustomer: rows[0] };
  }

  public async getLoginType(phone: string, deviceId?: string) {
    const { rows } = await pg.query(
      `Select *
                                     from customer
                                     where phone = $1`,
      [phone],
    );
    if (!rows[0]) throw new CustomError('USER_NOT_FOUND');
    if (!deviceId) {
      return { password: true, otp: false };
    }

    const { rows: customerPhone } = await pg.query(
      `Select *
                                                    from customer_device
                                                    where customer_id = $1`,
      [rows[0].id],
    );
    if (!customerPhone[0]) return { password: true, otp: false };
    const otpObject = {
      code: Math.floor(100000 + Math.random() * 900000),
      expiresAt: moment().add(2, 'minutes').valueOf(),
    };
    await this.redis.hSet('otp', rows[0].phone, JSON.stringify(otpObject));
    return { password: false, otp: true };
  }

  public async logout(customerData: Customer): Promise<Customer> {
    const { phone, hashed_password } = customerData;

    const { rows, rowCount } = await pg.query(
      `
        SELECT "phone",
               "hashed_password"
        FROM customer
        WHERE "phone" = $1
          AND "hashed_password" = $2
      `,
      [phone, hashed_password],
    );
    if (!rowCount) throw new HttpException(409, "Customer doesn't exist");

    return rows[0];
  }

  public async signUpMerchant(merchant: Merchant, email, code): Promise<{ tokenData: TokenData; merchant: any }> {
    const { name, password } = merchant;
    const { rows: findMerchant } = await pg.query(
      `
        SELECT EXISTS(
                 SELECT "email"
                 FROM merchant
                 WHERE "email" = $1
                 )`,
      [email],
    );
    if (findMerchant[0].exists) throw new CustomError('EMAIL_TAKEN');
    const redisCode = await this.redis.hGet('verification_code', email);
    const codeObject = JSON.parse(redisCode);
    if (!codeObject) throw new CustomError('WRONG_OTP');
    if (moment().isAfter(codeObject.expiresAt)) {
      await this.redis.hDel('verification_code', email);
      throw new CustomError('EXPIRED_OTP');
    }
    if (codeObject.numAttempt == 3) {
      throw new CustomError('EXPIRED_OTP');
    }
    if (codeObject.code === parseInt(code) && moment().isBefore(codeObject.expiresAt)) {
      const hashedPassword = await hash(password, 10);
      const { rows: signMerchantData } = await pg.query(
        `
        INSERT INTO merchant("name",
                             "email",
                             "hashed_password")
        VALUES ($1, $2, $3)
        RETURNING "id",email,hashed_password
      `,
        [name, email, hashedPassword],
      );
      await this.redis.hDel('verification_code', email);
      const tokenData = createTokenMerchant(signMerchantData[0]);
      return { merchant: signMerchantData[0], tokenData };
    }
    codeObject.numAttempt += 1;
    await this.redis.hSet('verification_code', email, JSON.stringify(codeObject));
    throw new CustomError('WRONG_OTP');
  }
  public async sendCode(email, resend): Promise<void> {
    const redisCode = await this.redis.hGet('verification_code', email);
    const codeObject = JSON.parse(redisCode);
    const codeObject1 = {
      code: Math.floor(100000 + Math.random() * 900000),
      expiresAt: moment().add(5, 'minutes').valueOf(),
      numAttempt: 0,
    };
    if (!redisCode || moment().isAfter(codeObject.expiresAt)) {
      await this.redis.hSet('verification_code', email, JSON.stringify(codeObject1));
      await MailSendingService.mailSender(email, codeObject1.code);
      return;
    }
    if (redisCode && resend) {
      if (moment().isAfter(codeObject.expiresAt)) {
        await this.redis.hSet('verification_code', email, JSON.stringify(codeObject1));
        await MailSendingService.mailSender(email, codeObject1.code);
        return;
      }
      const timeLeft = moment(codeObject.expiresAt).diff(moment(), 'seconds');
      throw new CustomError('CODE_ALREADY_SEND', null, { timeLeft });
    }
  }
  public async loginMerchant(email, password, deviceId): Promise<{ tokenData: TokenData; merchant: any }> {
    let merchantStatus: { is_blocked: boolean; last_login_attempt: moment.Moment; safe_login_after: number } = {
      is_blocked: false,
      last_login_attempt: null,
      safe_login_after: 0,
    };
    const { rows, rowCount } = await pg.query(
      `
        SELECT "id",
               "email",
               "hashed_password"
        FROM merchant
        WHERE "email" = $1
      `,
      [email],
    );
    if (!rowCount) throw new CustomError('USER_NOT_FOUND');
    const status_object = `${email}_${deviceId}`;
    const redis_status = await this.redis.hGet('merchant_status', status_object);
    if (redis_status) {
      merchantStatus = JSON.parse(redis_status);
      if (merchantStatus.is_blocked) {
        const unblockTime = moment(merchantStatus.last_login_attempt).add(1, 'minute');
        if (moment().isBefore(unblockTime)) {
          const timeLeft = unblockTime.diff(moment(), 'seconds');
          throw new CustomError('USER_BLOCKED', null, { timeLeft });
        }
        merchantStatus.is_blocked = false;
        merchantStatus.last_login_attempt = null;
      }
    }
    const isPasswordMatching: boolean = await compare(password, rows[0].hashed_password);
    if (!isPasswordMatching) {
      if (
        merchantStatus.last_login_attempt &&
        moment().isBefore(moment(merchantStatus.last_login_attempt).add(merchantStatus.safe_login_after, 'seconds'))
      ) {
        merchantStatus.is_blocked = true;
        merchantStatus.safe_login_after = 0;
      } else {
        merchantStatus.safe_login_after = merchantStatus.last_login_attempt
          ? Math.max(120 - moment().diff(merchantStatus.last_login_attempt, 'seconds'))
          : 0;
      }
      merchantStatus.last_login_attempt = moment();
      const statusObject = `${email}_${deviceId}`;
      await this.redis.hSet('merchant_status', statusObject, JSON.stringify(merchantStatus));
      if (merchantStatus.is_blocked) {
        throw new CustomError('USER_BLOCKED', null, { timeLeft: 60 });
      } else {
        throw new CustomError('WRONG_PASSWORD');
      }
    }
    const statusObject = `${email}_${deviceId}`;
    await this.redis.hDel('merchant_status', statusObject);
    const tokenData = createTokenMerchant(rows[0]);
    return { merchant: rows[0], tokenData };
  }
}
