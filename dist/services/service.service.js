"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceService = void 0;
const tslib_1 = require("tslib");
const typedi_1 = require("typedi");
const _database_1 = tslib_1.__importDefault(require("../database"));
const imageStorage_1 = require("../utils/imageStorage");
const CustomError_1 = require("../exceptions/CustomError");
let ServiceService = class ServiceService {
    constructor() {
        this.fileUploader = new imageStorage_1.FileUploader('eu-north-1', 'image-24');
    }
    async createService(serviceData, lang, image) {
        const { name, price, merchant_id, categoryId, isActive } = serviceData;
        const { rows } = await _database_1.default.query(`Select * from service where merchant_id=$1 and category_id=$2 and deleted = false`, [merchant_id, categoryId]);
        console.log(rows[0]);
        if (rows[0])
            throw new CustomError_1.CustomError('SERVICE_ALREADY_EXISTS');
        const newActive = isActive || false;
        const { rows: service } = await _database_1.default.query(`INSERT INTO service(name,price,merchant_id,category_id,is_active) values ($1,$2,$3,$4,$5) RETURNING (select message from message where name = 'SERVICE_CREATED')`, [name, price, merchant_id, categoryId, newActive]);
        if (image) {
            const uploadPath = await this.fileUploader.uploadFile(image, `${service[0].id}.${image.name.split('.').pop()}`);
            if (uploadPath)
                await _database_1.default.query(`Update service set image_url = $1 where id = $2`, [uploadPath, service[0].id]);
        }
        if (service[0]) {
            return service[0].message[lang];
        }
        throw new CustomError_1.CustomError('DATABASE_ERROR');
    }
    async getMerchantServices(merchantId, lang) {
        const { rows } = await _database_1.default.query(`
select s.id, s.merchant_id, s.category_id, s.name, s.price, s.image_url, s.is_active,
  c.code as category_code, c.name -> $1 as category_name
from service s
JOIN service_category c on s.category_id = c.id
where merchant_id = $2 and deleted = false`, [lang, merchantId]);
        if (!rows[0]) {
            return [];
        }
        const services = rows;
        services.forEach(service => {
            service.image_url = imageStorage_1.FileUploader.getUrl(service.image_url);
        });
        return services;
    }
    async getAllServices(lang, customerId) {
        const services = [];
        const { rows } = await _database_1.default.query(`select s.id, s.merchant_id, s.category_id, s.name, s.price, s.image_url,
      c.code as category_code, c.name -> $1 as category_name
    from service s
    JOIN service_category c on s.category_id = c.id
    where is_active = true and deleted = false`, [lang]);
        if (!rows[0])
            return [];
        rows.forEach(service => {
            service.image_url = imageStorage_1.FileUploader.getUrl(service.image_url);
            services.push(service);
        });
        const { rows: saved } = await _database_1.default.query(`Select * from customer_saved_service where customer_id =$1`, [customerId]);
        if (saved[0]) {
            services.forEach(service => {
                saved.forEach(save => {
                    if (service.id === save.service_id && save.customer_id === customerId) {
                        service.saved = true;
                    }
                });
            });
        }
        return services;
    }
    async getOneById(merchantId, serviceId, lang) {
        const { rows } = await _database_1.default.query(`
select s.*, c.code as category_code, c.name -> $3 as category_name
from service s
JOIN service_category c on s.category_id = c.id
where s.id = $1 and s.merchant_id = $2 and s.deleted = false`, [serviceId, merchantId, lang]);
        if (!rows[0])
            throw new CustomError_1.CustomError('SERVICE_NOT_FOUND');
        rows[0].image_url = imageStorage_1.FileUploader.getUrl(rows[0].image_url);
        return rows[0];
    }
    async deleteOneById(merchantId, serviceId, lang) {
        const { rows } = await _database_1.default.query(`Select * from service where id = $1 and merchant_id = $2`, [serviceId, merchantId]);
        if (!rows[0])
            throw new CustomError_1.CustomError('SERVICE_NOT_FOUND');
        const { rows: message } = await _database_1.default.query(`update service
                    set is_active = false,
                        deleted   = true
                    where id = $1
                      and merchant_id = $2
                      and deleted = false returning (select message from message where name = 'SERVICE_DELETED')`, [serviceId, merchantId]);
        return message[lang];
    }
    async updateService(merchantId, service, lang, image) {
        const { rows } = await _database_1.default.query(`Select * from service where merchant_id = $1 and id = $2`, [merchantId, service.id]);
        if (!rows[0])
            throw new CustomError_1.CustomError('SERVICE_NOT_FOUND');
        const name = service.name || rows[0].name;
        const categoryId = service.categoryId || rows[0].category_id;
        const price = service.price || rows[0].price;
        const isActive = service.isActive || rows[0].is_active;
        if (image || service.deleteImage) {
            await this.fileUploader.deleteFile(`${rows[0].image_url}`);
            if (image) {
                const uploadPath = await this.fileUploader.uploadFile(image, `${rows[0].id}.${image.name.split('.').pop()}`);
                await _database_1.default.query(`Update service set image_url = $1 where id = $2`, [uploadPath, service.id]);
            }
            else {
                await _database_1.default.query(`Update service set image_url = $1 where id = $2`, [null, service.id]);
            }
        }
        const { rows: message } = await _database_1.default.query(`Update service set name = $1, price = $2, category_id = $3,is_active = $4 where id = $5 returning (select message from message where name = 'SERVICE_UPDATED')`, [name, price, categoryId, isActive, service.id]);
        return message[0].message[lang];
    }
};
ServiceService = tslib_1.__decorate([
    (0, typedi_1.Service)(),
    tslib_1.__metadata("design:paramtypes", [])
], ServiceService);
exports.ServiceService = ServiceService;
//# sourceMappingURL=service.service.js.map