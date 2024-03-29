"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "CustomerService", {
    enumerable: true,
    get: function() {
        return CustomerService;
    }
});
const _typedi = require("typedi");
const _database = /*#__PURE__*/ _interop_require_default(require("../database"));
const _httpException = require("../exceptions/httpException");
const _imageStorage = require("../utils/imageStorage");
const _redis = require("../database/redis");
const _CustomError = require("../exceptions/CustomError");
const _moment = /*#__PURE__*/ _interop_require_default(require("moment"));
const _authservice = require("./auth.service");
const _socket = /*#__PURE__*/ _interop_require_default(require("../socket/socket"));
const _smsservice = require("./sms.service");
function _define_property(obj, key, value) {
    if (key in obj) {
        Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true
        });
    } else {
        obj[key] = value;
    }
    return obj;
}
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let CustomerService = class CustomerService {
    async findCustomerById(customerId) {
        const { rows, rowCount } = await _database.default.query(`
        SELECT *
        FROM customer
        WHERE id = $1
      `, [
            customerId
        ]);
        if (!rowCount) throw new _CustomError.CustomError('USER_NOT_FOUND');
        const { rows: summary } = await _database.default.query(`
with my_bank_cards as (
  select id, pan from customer_card where customer_id = $1
)
select
sum(case when type = 'expense' then amount else 0 END) as expense,
count(case when type = 'expense' then 1 else null END) as expense_count,
sum(case when type = 'income' then amount else 0 END) as income,
count(case when type = 'income' then 1 else null END) as income_count
from (
  select amount, type
  from transfer
  where extract(month from created_at) = extract(month from current_date)
    and owner_id = $1
    and (sender_id in (select id from my_bank_cards) and type = 'expense')
      or (receiver_id in (select id from my_bank_cards) and type = 'income')
  union all
  select amount, type
  from payment
  where extract(month from created_at) = extract(month from current_date)
    and owner_id = $1
    and sender_id in (select id from my_bank_cards) and type = 'expense'
) as combined_data;`, [
            customerId
        ]);
        const { rows: cards } = await _database.default.query(`Select sum(balance) from customer_card where customer_id =$1`, [
            customerId
        ]);
        const customer = rows[0];
        customer.balance = cards[0].sum;
        customer.summary = summary[0];
        return customer;
    }
    async updateCustomer(customerId, customerData, image) {
        const { rows: findCustomer } = await _database.default.query(`
                 SELECT *
                 FROM customer
                 WHERE "id" = $1`, [
            customerId
        ]);
        if (!findCustomer[0]) throw new _CustomError.CustomError('USER_NOT_FOUND');
        const name = customerData.name;
        const deleteImage = customerData.deleteImage;
        const newName = name || findCustomer[0].name;
        const gender = customerData.gender || findCustomer[0].gender;
        const newBirthDate = customerData.birthDate ? (0, _moment.default)(customerData.birthDate, 'DD/MM/YYYY').format('YYYY-MM-DDTHH:mm:ss.SSS[Z]').toString() : customerData.birthDate;
        const { rows: updateCustomerData } = await _database.default.query(`
        UPDATE
          customer
        SET "name" = $2,
            "gender"= $3,
            "birth_date"=$4
        WHERE "id" = $1 RETURNING *
      `, [
            customerId,
            newName,
            gender,
            newBirthDate
        ]);
        const fileUploader = new _imageStorage.FileUploader('eu-north-1', 'image-24');
        if (deleteImage) {
            await _database.default.query(`Update customer set image_url = $1 where id = $2`, [
                null,
                customerId
            ]);
            await fileUploader.deleteFile(findCustomer[0].image_url);
        }
        if (image) {
            await fileUploader.deleteFile(findCustomer[0].image_url);
            const objectKey = `${customerId}.${image.name.split('.').pop()}`;
            const uploadPath = await fileUploader.uploadFile(image, objectKey);
            const { rows: updateCustomer } = await _database.default.query(`Update customer set image_url = $1 where id= $2 returning *`, [
                uploadPath,
                customerId
            ]);
            if (updateCustomer[0]) {
                updateCustomer[0].image_url = uploadPath;
                return updateCustomer[0];
            }
        }
    }
    async deleteCustomer(customerId) {
        try {
            const { rows: findCustomer } = await _database.default.query(`
          SELECT EXISTS(
                   SELECT "id"
                   FROM customer
                   WHERE "id" = $1 ::uuid
                   )`, [
                customerId
            ]);
            if (!findCustomer[0].exists) {
                throw new _httpException.HttpException(409, "Customer doesn't exist");
            }
            await _database.default.query(`delete from customer_device where customer_id=$1`, [
                customerId
            ]);
            await _database.default.query(`
          DELETE
          FROM customer
          WHERE id = $1
        `, [
                customerId
            ]);
            return true;
        } catch (error) {
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
        await this.redis.hGet('otp', phone, (err, otp)=>{
            if (err) throw new _httpException.HttpException(403, err.message);
            return JSON.parse(otp).code.toString();
        });
        throw new _httpException.HttpException(404, 'Not found');
    }
    async addToSaved(customerId, serviceId) {
        await _database.default.query(`
insert into customer_saved_service(customer_id, service_id)
values($1, $2)
on conflict do nothing`, [
            customerId,
            serviceId
        ]);
    }
    async deleteFromSaved(customerId, serviceId) {
        const { rows } = await _database.default.query(`Select * from customer_saved_service where service_id =$1 and customer_id = $2`, [
            serviceId,
            customerId
        ]);
        if (!rows[0]) {
            throw new _CustomError.CustomError('SERVICE_NOT_FOUND');
        }
        await _database.default.query(`delete from customer_saved_service where customer_id  =$1 and service_id =$2`, [
            customerId,
            serviceId
        ]);
    }
    async updateCustomerLang(customerId, lang) {
        const { rows } = await _database.default.query(`Select * from customer where id = $1`, [
            customerId
        ]);
        if (!rows[0]) throw new _CustomError.CustomError('USER_NOT_FOUND');
        await _database.default.query(`Update customer set lang = $1 where id = $2`, [
            lang,
            customerId
        ]);
        return true;
    }
    async loginWithQr(qrLogin, customerId) {
        const redisQr = await this.redis.hGet('qr_login', qrLogin.allowDeviceId);
        if (!redisQr) throw new _CustomError.CustomError('INVALID_REQUEST');
        const qrObject = JSON.parse(redisQr);
        if (qrObject.key !== qrLogin.key) throw new _CustomError.CustomError('INVALID_REQUEST');
        const { rows } = await _database.default.query(`Select * from customer where id=$1`, [
            customerId
        ]);
        if (!rows[0]) throw new _CustomError.CustomError('USER_NOT_FOUND');
        const customer = rows[0];
        const tokenData = (0, _authservice.createToken)(customer);
        console.log(qrObject.socketId);
        _socket.default.to(qrObject.socketId).emit('qr_login_allow', {
            token: tokenData.token
        });
        return;
    }
    async getDevices(customerId) {
        const { rows } = await _database.default.query(`Select * from customer_device where customer_id =$1`, [
            customerId
        ]);
        return rows;
    }
    async deleteCustomerDevice(deviceId, customerId, lang) {
        const { rows } = await _database.default.query(`Select * from customer_device where device_id = $1 and customer_id = $2`, [
            deviceId,
            customerId
        ]);
        if (!rows[0]) {
            throw new _CustomError.CustomError('ALLOWED_FOR_TRUSTED');
        }
        const { rows: message } = await _database.default.query(`delete from customer_device
    where id = $1 and customer_id = $2
    returning (select message from message where name = 'UNTRUST_SUCCESS') as message`, [
            rows[0].id,
            customerId
        ]);
        if (!message[0]) throw new _CustomError.CustomError('DATABASE_ERROR');
        return message[0].message[lang];
    }
    async sendCodeToPhone(verify, deviceId, resend) {
        const redisCode = await this.redis.hGet('customer_otp', JSON.stringify({
            phone: verify.phone,
            deviceId
        }));
        const codeObject = JSON.parse(redisCode);
        const codeObject1 = {
            code: Math.floor(100000 + Math.random() * 900000),
            expiresAt: (0, _moment.default)().add(2, 'minutes').valueOf(),
            numAttempt: 0
        };
        console.log(deviceId);
        const device_phone = {
            phone: verify.phone,
            deviceId: deviceId
        };
        if (!redisCode || (0, _moment.default)().isAfter(codeObject.expiresAt)) {
            await this.redis.hSet('customer_otp', JSON.stringify(device_phone), JSON.stringify(codeObject1));
            await (0, _smsservice.sendVerification)(device_phone.phone, codeObject1.code);
            return (0, _moment.default)(codeObject1.expiresAt).diff((0, _moment.default)(), 'seconds');
        }
        if (redisCode && resend) {
            if ((0, _moment.default)().isAfter(codeObject.expiresAt)) {
                await this.redis.hSet('customer_otp', JSON.stringify(device_phone), JSON.stringify(codeObject1));
                await (0, _smsservice.sendVerification)(device_phone.phone, codeObject1.code);
                return (0, _moment.default)(codeObject1.expiresAt).diff((0, _moment.default)(), 'seconds');
            }
            const timeLeft = (0, _moment.default)(codeObject.expiresAt).diff((0, _moment.default)(), 'seconds');
            throw new _CustomError.CustomError('CODE_ALREADY_SEND', null, {
                timeLeft
            });
        }
    }
    constructor(){
        _define_property(this, "redis", void 0);
        this.redis = new _redis.RedisClient();
    }
};
CustomerService = _ts_decorate([
    (0, _typedi.Service)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [])
], CustomerService);

//# sourceMappingURL=customers.service.js.map