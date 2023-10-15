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

const createToken = (customer: Customer): TokenData => {
  const dataStoredInToken: DataStoredInToken = { id: customer.id };
  const expiresIn: number = 60 * 60;

  return { expiresIn, token: sign(dataStoredInToken, SECRET_KEY, { expiresIn }) };
};
const createTokenMerchant = (merchant: Merchant): TokenData => {
  const dataStoredInToken: DataStoredInToken = { id: merchant.id, role: 'Merchant' };
  const expiresIn: number = 60 * 60;

  return { expiresIn, token: sign(dataStoredInToken, SECRET_KEY, { expiresIn }) };
};
const createCookie = (tokenData: TokenData): string => {
  return `Authorization=${tokenData.token}; HttpOnly; Max-Age=${tokenData.expiresIn};`;
};

@Service()
export class AuthService {
  private redis: RedisClient;
  constructor() {
    this.redis = new RedisClient();
  }
  public async signup(customerData: Customer, uid?: string, trust: boolean): Promise<{ customer: Customer; cookie: string }> {
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
    if (findCustomer[0].exists) throw new HttpException(409, `This phone ${customerData.phone} already exists`);

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
      pg.query(
        `INSERT INTO customer_device(customer_id, device_id)
         values ($1, $2)`,
        [signUpCustomerData[0].id, uid],
      );
    }
    const tokenData = createToken(signUpCustomerData[0]);
    const cookie = createCookie(tokenData);
    return { customer: signUpCustomerData[0], cookie };
  }

  public async login(CustomerData: CustomerLogin, deviceId: any): Promise<{ cookie: string; findCustomer: Customer }> {
    try {
      let customerStatus: { is_blocked: boolean; last_login_attempt; safe_login_after: number };
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

      // Use `await` when working with Redis
      const customerStatusResult = await this.redis.hGet('customer_status', phone);
      if (customerStatusResult) {
        customerStatus = JSON.parse(customerStatusResult);

        if (customerStatus.is_blocked) {
          const unBlockTime = moment(customerStatus.last_login_attempt).add(1, 'minute');

          if (moment().isBefore(unBlockTime)) {
            const timeLeft = unBlockTime.diff(moment(), 'seconds');
            throw new HttpException(403, `User is blocked, try again after ${timeLeft} seconds`);
          }

          customerStatus.is_blocked = false;
          customerStatus.last_login_attempt = false;
        }
      }
      console.log(deviceId, rows[0].id);
      // Use `await` when querying the database
      const deviceResult = await pg.query(`Select * from customer_device where device_id= $1 and customer_id = $2`, [deviceId, rows[0].id]);

      const loginType = deviceResult.rows.length > 0 ? 'otp' : 'password';
      /* Validator password and otp */
      if (loginType === 'password') {
        console.log(loginType);
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

          // Use `await` when working with Redis
          await this.redis.hSet('customer_status', phone, JSON.stringify(customerStatus));

          if (customerStatus.is_blocked) {
            throw new HttpException(403, `User is blocked, try again after ${60} seconds`);
          } else {
            throw new HttpException(404, 'WRONG_PASSWORD');
          }
        }
      } else {
        // Use `await` when working with Redis
        const redisOtp = await this.redis.hGet('otp', phone);

        if (!redisOtp) {
          return;
        }

        const otpObject = JSON.parse(redisOtp);

        if (moment().isAfter(otpObject.expiresAt)) {
          // Use `await` when working with Redis
          await this.redis.hDel('otp', phone);
          throw new HttpException(401, 'EXPIRED_OTP');
        }

        if (otpObject.code === parseInt(otp) && moment().isBefore(otpObject.expiresAt)) {
          // Use `await` when working with Redis
          await this.redis.hDel('otp', phone);
        } else {
          return;
        }
      }

      if (newTrust) {
        // Use `await` when querying the database
        await pg.query(`Insert into customer_device(customer_id, device_id) values ($1,$2)`, [rows[0].id, deviceId]);
      }

      const tokenData = createToken(rows[0]);
      const cookie = createCookie(tokenData);
      return { cookie, findCustomer: rows[0] };
    } catch (error) {
      throw new CustomError(error.name); // Handle and log the error properly
    }
  }

  public async getLoginType(phone: string, deviceId?: string) {
    const { rows } = await pg.query(
      `Select *
                                     from customer
                                     where phone = $1`,
      [phone],
    );
    if (rows[0].exists) throw new HttpException(404, 'User not found');
    if (!deviceId) return { password: true, otp: false };

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
    this.redis.hSet('otp', rows[0].phone, JSON.stringify(otpObject));
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

  public async signUpMerchant(merchant: Merchant): Promise<{ merchant: Merchant; cookie: string }> {
    const { name, email, password } = merchant;
    const { rows: findMerchant } = await pg.query(
      `
        SELECT EXISTS(
                 SELECT "email"
                 FROM merchant
                 WHERE "email" = $1
                 )`,
      [email],
    );
    if (findMerchant[0].exists) throw new HttpException(409, `This phone ${merchant.email} already exists`);

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
    const tokenData = createTokenMerchant(signMerchantData[0]);
    const cookie = createCookie(tokenData);
    return { merchant: signMerchantData[0], cookie };
  }

  public async loginMerchant(merchant: Merchant): Promise<{ merchant: Merchant; cookie: string }> {
    const { email, password } = merchant;
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
    if (!rowCount) throw new HttpException(409, `This phone ${email} was not found`);

    const isPasswordMatching: boolean = await compare(password, rows[0].hashed_password);
    if (!isPasswordMatching) throw new HttpException(409, 'Your password not matching');
    const tokenData = createTokenMerchant(rows[0]);
    const cookie = createCookie(tokenData);
    return { merchant: rows[0], cookie };
  }
}
