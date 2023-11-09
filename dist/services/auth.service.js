"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const tslib_1 = require("tslib");
const bcrypt_1 = require("bcrypt");
const jsonwebtoken_1 = require("jsonwebtoken");
const typedi_1 = require("typedi");
const _config_1 = require("../config");
const _database_1 = tslib_1.__importDefault(require("../database"));
const httpException_1 = require("../exceptions/httpException");
const redis_1 = require("../database/redis");
const moment_1 = tslib_1.__importDefault(require("moment"));
const bcrypt_2 = tslib_1.__importDefault(require("bcrypt"));
const CustomError_1 = require("../exceptions/CustomError");
const mailSending_service_1 = require("./mailSending.service");
const createToken = (customer) => {
    const dataStoredInToken = { id: customer.id };
    const expiresIn = '1h';
    return { expiresIn, token: (0, jsonwebtoken_1.sign)(dataStoredInToken, _config_1.SECRET_KEY, { expiresIn }) };
};
const createTokenMerchant = (merchant) => {
    const dataStoredInToken = { id: merchant.id, role: 'Merchant' };
    const expiresIn = '1h';
    return { expiresIn, token: (0, jsonwebtoken_1.sign)(dataStoredInToken, _config_1.SECRET_KEY, { expiresIn }) };
};
let AuthService = class AuthService {
    constructor() {
        this.redis = new redis_1.RedisClient();
    }
    async signup(customerData, trust, uid) {
        const { name, phone, password } = customerData;
        const { rows: findCustomer } = await _database_1.default.query(`
        SELECT EXISTS(
                 SELECT "phone"
                 FROM customer
                 WHERE "phone" = $1
                 )`, [phone]);
        if (findCustomer[0].exists)
            throw new CustomError_1.CustomError('NUMBER_TAKEN');
        const hashedPassword = await (0, bcrypt_1.hash)(password, 10);
        const { rows: signUpCustomerData } = await _database_1.default.query(`
        INSERT INTO customer("name",
                             "phone",
                             "hashed_password")
        VALUES ($1, $2, $3)
        RETURNING "id",phone,hashed_password
      `, [name, phone, hashedPassword]);
        if (uid && trust) {
            console.log(uid);
            await _database_1.default.query(`INSERT INTO customer_device(customer_id, device_id)
         values ($1, $2)`, [signUpCustomerData[0].id, uid]);
        }
        const tokenData = createToken(signUpCustomerData[0]);
        const token = tokenData.token;
        return { customer: signUpCustomerData[0], token };
    }
    async login(CustomerData, deviceId) {
        let customerStatus = {};
        const { phone, password, trust, otp } = CustomerData;
        const newTrust = trust || false;
        const { rows, rowCount } = await _database_1.default.query(`
        SELECT "id",
               "phone",
               "hashed_password"
        FROM customer
        WHERE "phone" = $1
      `, [phone]);
        if (!rowCount) {
            throw new CustomError_1.CustomError('USER_NOT_FOUND');
        }
        const status_object = JSON.stringify({ phone, deviceId });
        const customerStatusResult = await this.redis.hGet('customer_status', status_object);
        if (customerStatusResult) {
            customerStatus = JSON.parse(customerStatusResult);
            if (customerStatus.is_blocked) {
                const unBlockTime = (0, moment_1.default)(customerStatus.last_login_attempt).add(1, 'minute');
                if ((0, moment_1.default)().isBefore(unBlockTime)) {
                    const timeLeft = unBlockTime.diff((0, moment_1.default)(), 'seconds');
                    throw new CustomError_1.CustomError('USER_BLOCKED', null, timeLeft);
                }
                customerStatus.is_blocked = false;
                customerStatus.last_login_attempt = null; // Set to null since it's not a Moment object anymore
            }
        }
        const deviceResult = await _database_1.default.query(`Select * from customer_device where device_id= $1 and customer_id = $2`, [deviceId, rows[0].id]);
        const loginType = deviceResult.rows.length > 0 ? 'otp' : 'password';
        if (loginType === 'password') {
            const isCorrect = bcrypt_2.default.compareSync(password, rows[0].hashed_password);
            if (!isCorrect) {
                if (customerStatus.last_login_attempt &&
                    (0, moment_1.default)().isBefore((0, moment_1.default)(customerStatus.last_login_attempt).add(customerStatus.safe_login_after, 'seconds'))) {
                    customerStatus.is_blocked = true;
                    customerStatus.safe_login_after = 0;
                }
                else {
                    customerStatus.safe_login_after = customerStatus.last_login_attempt
                        ? Math.max(60 - (0, moment_1.default)().diff(customerStatus.last_login_attempt, 'seconds'), 0)
                        : 0;
                }
                customerStatus.last_login_attempt = (0, moment_1.default)();
                const status_object = JSON.stringify({ phone, deviceId });
                await this.redis.hSet('customer_status', status_object, JSON.stringify(customerStatus));
                if (customerStatus.is_blocked) {
                    throw new CustomError_1.CustomError('USER_BLOCKED');
                }
                else {
                    throw new CustomError_1.CustomError('WRONG_PASSWORD');
                }
            }
        }
        else {
            const redisOtp = await this.redis.hGet('otp', phone);
            if (!redisOtp) {
                return;
            }
            const otpObject = JSON.parse(redisOtp);
            if ((0, moment_1.default)().isAfter(otpObject.expiresAt)) {
                await this.redis.hDel('otp', phone);
                throw new CustomError_1.CustomError('EXPIRED_OTP');
            }
            if (otpObject.code === parseInt(otp) && (0, moment_1.default)().isBefore(otpObject.expiresAt)) {
                await this.redis.hDel('otp', phone);
            }
            else {
                return;
            }
        }
        if (newTrust) {
            await _database_1.default.query(`Insert into customer_device(customer_id, device_id) values ($1,$2)`, [rows[0].id, deviceId]);
        }
        const tokenData = createToken(rows[0]);
        return { tokenData, findCustomer: rows[0] };
    }
    async getLoginType(phone, deviceId) {
        const { rows } = await _database_1.default.query(`Select *
                                     from customer
                                     where phone = $1`, [phone]);
        if (!rows[0])
            throw new CustomError_1.CustomError('USER_NOT_FOUND');
        if (!deviceId) {
            return { password: true, otp: false };
        }
        const { rows: customerPhone } = await _database_1.default.query(`Select *
                                                    from customer_device
                                                    where customer_id = $1`, [rows[0].id]);
        if (!customerPhone[0])
            return { password: true, otp: false };
        const otpObject = {
            code: Math.floor(100000 + Math.random() * 900000),
            expiresAt: (0, moment_1.default)().add(2, 'minutes').valueOf(),
        };
        await this.redis.hSet('otp', rows[0].phone, JSON.stringify(otpObject));
        return { password: false, otp: true };
    }
    async logout(customerData) {
        const { phone, hashed_password } = customerData;
        const { rows, rowCount } = await _database_1.default.query(`
        SELECT "phone",
               "hashed_password"
        FROM customer
        WHERE "phone" = $1
          AND "hashed_password" = $2
      `, [phone, hashed_password]);
        if (!rowCount)
            throw new httpException_1.HttpException(409, "Customer doesn't exist");
        return rows[0];
    }
    async signUpMerchant(merchant, email, code) {
        const { name, password } = merchant;
        const { rows: findMerchant } = await _database_1.default.query(`
        SELECT EXISTS(
                 SELECT "email"
                 FROM merchant
                 WHERE "email" = $1
                 )`, [email]);
        if (findMerchant[0].exists)
            throw new CustomError_1.CustomError('EMAIL_TAKEN');
        const redisCode = await this.redis.hGet('verification_code', email);
        const codeObject = JSON.parse(redisCode);
        if (!codeObject)
            throw new CustomError_1.CustomError('WRONG_OTP');
        if ((0, moment_1.default)().isAfter(codeObject.expiresAt)) {
            await this.redis.hDel('verification_code', email);
            throw new CustomError_1.CustomError('EXPIRED_OTP');
        }
        if (codeObject.numAttempt == 3) {
            throw new CustomError_1.CustomError('TOO_MANY_TRIES');
        }
        if (codeObject.code === parseInt(code) && (0, moment_1.default)().isBefore(codeObject.expiresAt)) {
            const hashedPassword = await (0, bcrypt_1.hash)(password, 10);
            const { rows: signMerchantData } = await _database_1.default.query(`
        INSERT INTO merchant("name",
                             "email",
                             "hashed_password")
        VALUES ($1, $2, $3)
        RETURNING "id",email,hashed_password
      `, [name, email, hashedPassword]);
            await this.redis.hDel('verification_code', email);
            const tokenData = createTokenMerchant(signMerchantData[0]);
            return { merchant: signMerchantData[0], tokenData };
        }
        codeObject.numAttempt += 1;
        await this.redis.hSet('verification_code', email, JSON.stringify(codeObject));
        throw new CustomError_1.CustomError('WRONG_OTP');
    }
    async sendCode(email, resend) {
        const redisCode = await this.redis.hGet('verification_code', email);
        const codeObject = JSON.parse(redisCode);
        const codeObject1 = {
            code: Math.floor(100000 + Math.random() * 900000),
            expiresAt: (0, moment_1.default)().add(2, 'minutes').valueOf(),
            numAttempt: 0,
        };
        if (!redisCode || (0, moment_1.default)().isAfter(codeObject.expiresAt)) {
            await this.redis.hSet('verification_code', email, JSON.stringify(codeObject1));
            await mailSending_service_1.MailSendingService.mailSender(email, codeObject1.code);
            return (0, moment_1.default)(codeObject1.expiresAt).diff((0, moment_1.default)(), 'seconds');
        }
        if (redisCode && resend) {
            if ((0, moment_1.default)().isAfter(codeObject.expiresAt)) {
                await this.redis.hSet('verification_code', email, JSON.stringify(codeObject1));
                await mailSending_service_1.MailSendingService.mailSender(email, codeObject1.code);
                return (0, moment_1.default)(codeObject1.expiresAt).diff((0, moment_1.default)(), 'seconds');
            }
            const timeLeft = (0, moment_1.default)(codeObject.expiresAt).diff((0, moment_1.default)(), 'seconds');
            throw new CustomError_1.CustomError('CODE_ALREADY_SEND', null, { timeLeft });
        }
    }
    async loginMerchant(email, password, deviceId) {
        let merchantStatus = {
            is_blocked: false,
            last_login_attempt: null,
            safe_login_after: 0,
        };
        const { rows, rowCount } = await _database_1.default.query(`
        SELECT "id",
               "email",
               "hashed_password"
        FROM merchant
        WHERE "email" = $1
      `, [email]);
        if (!rowCount)
            throw new CustomError_1.CustomError('USER_NOT_FOUND');
        const status_object = `${email}_${deviceId}`;
        const redis_status = await this.redis.hGet('merchant_status', status_object);
        if (redis_status) {
            merchantStatus = JSON.parse(redis_status);
            if (merchantStatus.is_blocked) {
                const unblockTime = (0, moment_1.default)(merchantStatus.last_login_attempt).add(1, 'minute');
                if ((0, moment_1.default)().isBefore(unblockTime)) {
                    const timeLeft = unblockTime.diff((0, moment_1.default)(), 'seconds');
                    throw new CustomError_1.CustomError('USER_BLOCKED', null, timeLeft);
                }
                merchantStatus.is_blocked = false;
                merchantStatus.last_login_attempt = null;
            }
        }
        const isPasswordMatching = await (0, bcrypt_1.compare)(password, rows[0].hashed_password);
        if (!isPasswordMatching) {
            if (merchantStatus.last_login_attempt &&
                (0, moment_1.default)().isBefore((0, moment_1.default)(merchantStatus.last_login_attempt).add(merchantStatus.safe_login_after, 'seconds'))) {
                merchantStatus.is_blocked = true;
                merchantStatus.safe_login_after = 0;
            }
            else {
                merchantStatus.safe_login_after = merchantStatus.last_login_attempt
                    ? Math.max(120 - (0, moment_1.default)().diff(merchantStatus.last_login_attempt, 'seconds'))
                    : 0;
            }
            merchantStatus.last_login_attempt = (0, moment_1.default)();
            const statusObject = `${email}_${deviceId}`;
            await this.redis.hSet('merchant_status', statusObject, JSON.stringify(merchantStatus));
            if (merchantStatus.is_blocked) {
                const unblockTime = (0, moment_1.default)(merchantStatus.last_login_attempt).add(1, 'minute');
                const timeLeft = unblockTime.diff((0, moment_1.default)(), 'seconds');
                throw new CustomError_1.CustomError('USER_BLOCKED', null, timeLeft);
            }
            else {
                throw new CustomError_1.CustomError('WRONG_PASSWORD');
            }
        }
        const statusObject = `${email}_${deviceId}`;
        await this.redis.hDel('merchant_status', statusObject);
        const tokenData = createTokenMerchant(rows[0]);
        return { merchant: rows[0], tokenData };
    }
};
AuthService = tslib_1.__decorate([
    (0, typedi_1.Service)(),
    tslib_1.__metadata("design:paramtypes", [])
], AuthService);
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map