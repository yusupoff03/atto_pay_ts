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
const _bcrypt = require("bcrypt");
const _typedi = require("typedi");
const _database = /*#__PURE__*/ _interop_require_default(require("../database"));
const _httpException = require("../exceptions/httpException");
const _imageStorage = require("../utils/imageStorage");
const _redis = require("../database/redis");
const _CustomError = require("../exceptions/CustomError");
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
    async findAllCustomer() {
        const { rows } = await _database.default.query(`
      SELECT *
      FROM customer
    `);
        return rows;
    }
    async findCustomerById(customerId) {
        const { rows, rowCount } = await _database.default.query(`
        SELECT *
        FROM customer
        WHERE id = $1
      `, [
            customerId
        ]);
        if (!rowCount) throw new _CustomError.CustomError('USER_NOT_FOUND');
        const { rows: cards } = await _database.default.query(`Select sum(balance) from customer_card where customer_id =$1`, [
            customerId
        ]);
        const customer = rows[0];
        customer.balance = cards[0].sum;
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
        const password = customerData.password;
        const deleteImage = customerData.deleteImage;
        const hashedPassword = password ? await (0, _bcrypt.hash)(password, 10) : findCustomer[0].password;
        const newName = name || findCustomer[0].name;
        const newPassword = hashedPassword || findCustomer[0].hashed_password;
        const gender = customerData.gender || findCustomer[0].gender;
        const birthDate = customerData.birthDate || findCustomer[0].birthDate;
        const { rows: updateCustomerData } = await _database.default.query(`
        UPDATE
          customer
        SET "name"    = $2,
            "hashed_password" = $3,
            "gender"= $4,
            "birth_date"=$5
        WHERE "id" = $1 RETURNING *
      `, [
            customerId,
            newName,
            newPassword,
            gender,
            birthDate
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
            console.log(`Deleting customer with ID: ${customerId}`);
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