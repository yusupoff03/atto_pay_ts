"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomerService = void 0;
const tslib_1 = require("tslib");
const typedi_1 = require("typedi");
const _database_1 = tslib_1.__importDefault(require("@database"));
const httpException_1 = require("@exceptions/httpException");
const imageStorage_1 = require("@utils/imageStorage");
const redis_1 = require("@/database/redis");
const CustomError_1 = require("@exceptions/CustomError");
const moment_1 = tslib_1.__importDefault(require("moment"));
const auth_service_1 = require("@services/auth.service");
const socket_1 = tslib_1.__importDefault(require("@/socket/socket"));
const sms_service_1 = require("@services/sms.service");
let CustomerService = class CustomerService {
    constructor() {
        this.redis = new redis_1.RedisClient();
    }
    async findCustomerById(customerId) {
        const { rows, rowCount } = await _database_1.default.query(`
        SELECT *
        FROM customer
        WHERE id = $1
      `, [customerId]);
        if (!rowCount)
            throw new CustomError_1.CustomError('USER_NOT_FOUND');
        const { rows: cards } = await _database_1.default.query(`Select sum(balance) from customer_card where customer_id =$1`, [customerId]);
        const customer = rows[0];
        customer.balance = cards[0].sum;
        return customer;
    }
    async updateCustomer(customerId, customerData, image) {
        const { rows: findCustomer } = await _database_1.default.query(`
                 SELECT *
                 FROM customer
                 WHERE "id" = $1`, [customerId]);
        if (!findCustomer[0])
            throw new CustomError_1.CustomError('USER_NOT_FOUND');
        const name = customerData.name;
        const deleteImage = customerData.deleteImage;
        const newName = name || findCustomer[0].name;
        const gender = customerData.gender || findCustomer[0].gender;
        const newBirthDate = customerData.birthDate
            ? (0, moment_1.default)(customerData.birthDate, 'DD/MM/YYYY').format('YYYY-MM-DDTHH:mm:ss.SSS[Z]').toString()
            : customerData.birthDate;
        const { rows: updateCustomerData } = await _database_1.default.query(`
        UPDATE
          customer
        SET "name" = $2,
            "gender"= $3,
            "birth_date"=$4
        WHERE "id" = $1 RETURNING *
      `, [customerId, newName, gender, newBirthDate]);
        const fileUploader = new imageStorage_1.FileUploader('eu-north-1', 'image-24');
        if (deleteImage) {
            await _database_1.default.query(`Update customer set image_url = $1 where id = $2`, [null, customerId]);
            await fileUploader.deleteFile(findCustomer[0].image_url);
        }
        if (image) {
            await fileUploader.deleteFile(findCustomer[0].image_url);
            const objectKey = `${customerId}.${image.name.split('.').pop()}`;
            const uploadPath = await fileUploader.uploadFile(image, objectKey);
            const { rows: updateCustomer } = await _database_1.default.query(`Update customer set image_url = $1 where id= $2 returning *`, [uploadPath, customerId]);
            if (updateCustomer[0]) {
                updateCustomer[0].image_url = uploadPath;
                return updateCustomer[0];
            }
        }
    }
    async deleteCustomer(customerId) {
        try {
            const { rows: findCustomer } = await _database_1.default.query(`
          SELECT EXISTS(
                   SELECT "id"
                   FROM customer
                   WHERE "id" = $1 ::uuid
                   )`, [customerId]);
            if (!findCustomer[0].exists) {
                throw new httpException_1.HttpException(409, "Customer doesn't exist");
            }
            await _database_1.default.query(`delete from customer_device where customer_id=$1`, [customerId]);
            await _database_1.default.query(`
          DELETE
          FROM customer
          WHERE id = $1
        `, [customerId]);
            return true;
        }
        catch (error) {
            console.error(`Error deleting customer:`, error);
            throw error;
        }
    }
    static async getDeviceInfo(req) {
        let { os, platform } = req.useragent;
        const { browser, version } = req.useragent;
        platform = platform === 'unknown' ? '' : platform;
        os = os === 'unknown' ? '' : os;
        return `${platform} ${os} ${browser} ${version}`.trim();
    }
    async getOtp(phone) {
        await this.redis.hGet('otp', phone, (err, otp) => {
            if (err)
                throw new httpException_1.HttpException(403, err.message);
            return JSON.parse(otp).code.toString();
        });
        throw new httpException_1.HttpException(404, 'Not found');
    }
    async addToSaved(customerId, serviceId) {
        await _database_1.default.query(`
insert into customer_saved_service(customer_id, service_id)
values($1, $2)
on conflict do nothing`, [customerId, serviceId]);
    }
    async deleteFromSaved(customerId, serviceId) {
        const { rows } = await _database_1.default.query(`Select * from customer_saved_service where service_id =$1 and customer_id = $2`, [serviceId, customerId]);
        if (!rows[0]) {
            throw new CustomError_1.CustomError('SERVICE_NOT_FOUND');
        }
        await _database_1.default.query(`delete from customer_saved_service where customer_id  =$1 and service_id =$2`, [customerId, serviceId]);
    }
    async updateCustomerLang(customerId, lang) {
        const { rows } = await _database_1.default.query(`Select * from customer where id = $1`, [customerId]);
        if (!rows[0])
            throw new CustomError_1.CustomError('USER_NOT_FOUND');
        await _database_1.default.query(`Update customer set lang = $1 where id = $2`, [lang, customerId]);
        return true;
    }
    async loginWithQr(qrLogin, customerId) {
        const redisQr = await this.redis.hGet('qr_login', customerId);
        if (!redisQr)
            throw new CustomError_1.CustomError('INVALID_REQUEST');
        const qrObject = JSON.parse(redisQr);
        if (qrObject.key !== qrLogin.key)
            throw new CustomError_1.CustomError('INVALID_REQUEST');
        const { rows } = await _database_1.default.query(`Select * from customer where id=$1`, [customerId]);
        if (!rows[0])
            throw new CustomError_1.CustomError('USER_NOT_FOUND');
        const customer = rows[0];
        const tokenData = (0, auth_service_1.createToken)(customer);
        socket_1.default.to(qrObject.socketId).emit(tokenData.token);
        return;
    }
    async getDevices(customerId) {
        const { rows } = await _database_1.default.query(`Select * from customer_device where customer_id =$1`, [customerId]);
        return rows;
    }
    async deleteCustomerDevice(deviceId, customerId, lang) {
        const { rows } = await _database_1.default.query(`Select * from customer_device where device_id = $1 and customer_id = $2`, [deviceId, customerId]);
        if (!rows[0]) {
            throw new CustomError_1.CustomError('ALLOWED_FOR_TRUSTED');
        }
        const { rows: message } = await _database_1.default.query(`delete from customer_device
    where id = $1 and customer_id = $2
    returning (select message from message where name = 'UNTRUST_SUCCESS') as message`, [rows[0].id, customerId]);
        if (!message[0])
            throw new CustomError_1.CustomError('DATABASE_ERROR');
        return message[0].message[lang];
    }
    async sendCodeToPhone(verify, deviceId, resend) {
        const redisCode = await this.redis.hGet('customer_otp', JSON.stringify({ phone: verify.phone, deviceId }));
        const codeObject = JSON.parse(redisCode);
        const codeObject1 = {
            code: Math.floor(100000 + Math.random() * 900000),
            expiresAt: (0, moment_1.default)().add(2, 'minutes').valueOf(),
            numAttempt: 0,
        };
        const device_phone = {
            phone: verify.phone,
            deviceId: deviceId,
        };
        if (!redisCode || (0, moment_1.default)().isAfter(codeObject.expiresAt)) {
            await this.redis.hSet('customer_otp', JSON.stringify(device_phone), JSON.stringify(codeObject1));
            await (0, sms_service_1.sendVerification)(device_phone.phone, codeObject1.code);
            return (0, moment_1.default)(codeObject1.expiresAt).diff((0, moment_1.default)(), 'seconds');
        }
        if (redisCode && resend) {
            if ((0, moment_1.default)().isAfter(codeObject.expiresAt)) {
                await this.redis.hSet('customer_otp', JSON.stringify(device_phone), JSON.stringify(codeObject1));
                await (0, sms_service_1.sendVerification)(device_phone.phone, codeObject1.code);
                return (0, moment_1.default)(codeObject1.expiresAt).diff((0, moment_1.default)(), 'seconds');
            }
            const timeLeft = (0, moment_1.default)(codeObject.expiresAt).diff((0, moment_1.default)(), 'seconds');
            throw new CustomError_1.CustomError('CODE_ALREADY_SEND', null, { timeLeft });
        }
    }
};
CustomerService = tslib_1.__decorate([
    (0, typedi_1.Service)(),
    tslib_1.__metadata("design:paramtypes", [])
], CustomerService);
exports.CustomerService = CustomerService;
//# sourceMappingURL=customers.service.js.map