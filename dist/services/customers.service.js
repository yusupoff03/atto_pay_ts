"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomerService = void 0;
const tslib_1 = require("tslib");
const bcrypt_1 = require("bcrypt");
const typedi_1 = require("typedi");
const _database_1 = tslib_1.__importDefault(require("../database"));
const httpException_1 = require("../exceptions/httpException");
const imageStorage_1 = require("../utils/imageStorage");
const redis_1 = require("../database/redis");
const CustomError_1 = require("../exceptions/CustomError");
let CustomerService = class CustomerService {
    constructor() {
        this.redis = new redis_1.RedisClient();
    }
    async findAllCustomer() {
        const { rows } = await _database_1.default.query(`
      SELECT *
      FROM customer
    `);
        return rows;
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
        const password = customerData.password;
        const deleteImage = customerData.deleteImage;
        const hashedPassword = password ? await (0, bcrypt_1.hash)(password, 10) : findCustomer[0].password;
        const newName = name || findCustomer[0].name;
        const newPassword = hashedPassword || findCustomer[0].hashed_password;
        const gender = customerData.gender || findCustomer[0].gender;
        const birthDate = customerData.birthDate || findCustomer[0].birthDate;
        const { rows: updateCustomerData } = await _database_1.default.query(`
        UPDATE
          customer
        SET "name"    = $2,
            "hashed_password" = $3,
            "gender"= $4,
            "birth_date"=$5
        WHERE "id" = $1 RETURNING *
      `, [customerId, newName, newPassword, gender, birthDate]);
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
            console.log(`Deleting customer with ID: ${customerId}`);
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
};
CustomerService = tslib_1.__decorate([
    (0, typedi_1.Service)(),
    tslib_1.__metadata("design:paramtypes", [])
], CustomerService);
exports.CustomerService = CustomerService;
//# sourceMappingURL=customers.service.js.map