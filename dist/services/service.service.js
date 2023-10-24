"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ServiceService", {
    enumerable: true,
    get: function() {
        return ServiceService;
    }
});
const _typedi = require("typedi");
const _database = /*#__PURE__*/ _interop_require_default(require("../database"));
const _imageStorage = require("../utils/imageStorage");
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
let ServiceService = class ServiceService {
    async createService(serviceData, lang, image) {
        const { name, price, merchant_id, categoryId, isActive } = serviceData;
        const { rows } = await _database.default.query(`Select * from service where merchant_id=$1 and category_id=$2 and deleted = false`, [
            merchant_id,
            categoryId
        ]);
        if (rows[0]) throw new _CustomError.CustomError('SERVICE_ALREADY_EXISTS');
        const newActive = isActive || false;
        const { rows: service } = await _database.default.query(`INSERT INTO service(name,price,merchant_id,category_id,is_active) values ($1,$2,$3,$4,$5) RETURNING (select message from message where name = 'SERVICE_CREATED')`, [
            name,
            price,
            merchant_id,
            categoryId,
            newActive
        ]);
        if (image) {
            const uploadPath = await this.fileUploader.uploadFile(image, `${service[0].id}.${image.name.split('.').pop()}`);
            if (uploadPath) await _database.default.query(`Update service set image_url = $1 where id = $2`, [
                uploadPath,
                service[0].id
            ]);
        }
        if (service[0]) {
            return service[0].message[lang];
        }
        throw new _CustomError.CustomError('DATABASE_ERROR');
    }
    async getMerchantServices(merchantId, lang) {
        const { rows } = await _database.default.query(`
select s.id, s.merchant_id, s.category_id, s.name, s.price, s.image_url, s.is_active,
  c.code as category_code, c.name -> $1 as category_name
from service s
JOIN service_category c on s.category_id = c.id
where merchant_id = $2 and deleted = false`, [
            lang,
            merchantId
        ]);
        if (!rows[0]) {
            return [];
        }
        const services = rows;
        services.forEach((service)=>{
            service.image_url = _imageStorage.FileUploader.getUrl(service.image_url);
        });
        return services;
    }
    async getAllServices(lang, customerId) {
        const services = [];
        const { rows } = await _database.default.query(`select s.id, s.merchant_id, s.category_id, s.name, s.price, s.image_url,
      c.code as category_code, c.name -> $1 as category_name
    from service s
    JOIN service_category c on s.category_id = c.id
    where is_active = true and deleted = false`, [
            lang
        ]);
        if (!rows[0]) return [];
        rows.forEach((service)=>{
            service.image_url = _imageStorage.FileUploader.getUrl(service.image_url);
            services.push(service);
        });
        const { rows: saved } = await _database.default.query(`Select * from customer_saved_service where customer_id =$1`, [
            customerId
        ]);
        if (saved[0]) {
            services.forEach((service)=>{
                saved.forEach((save)=>{
                    if (service.id === save.service_id && save.customer_id === customerId) {
                        service.saved = true;
                    }
                });
            });
        }
        console.log(services);
        return services;
    }
    async getOneById(merchantId, serviceId, lang) {
        const { rows } = await _database.default.query(`
select s.*, c.code as category_code, c.name -> $3 as category_name
from service s
JOIN service_category c on s.category_id = c.id
where s.id = $1 and s.merchant_id = $2 and s.deleted = false`, [
            serviceId,
            merchantId,
            lang
        ]);
        if (!rows[0]) throw new _CustomError.CustomError('SERVICE_NOT_FOUND');
        rows[0].image_url = _imageStorage.FileUploader.getUrl(rows[0].image_url);
        return rows[0];
    }
    async deleteOneById(merchantId, serviceId, lang) {
        const { rows } = await _database.default.query(`Select * from service where id = $1 and merchant_id = $2`, [
            serviceId,
            merchantId
        ]);
        if (!rows[0]) throw new _CustomError.CustomError('SERVICE_NOT_FOUND');
        const { rows: message } = await _database.default.query(`update service
                    set is_active = false,
                        deleted   = true
                    where id = $1
                      and merchant_id = $2
                      and deleted = false returning (select message from message where name = 'SERVICE_DELETED')`, [
            serviceId,
            merchantId
        ]);
        return message[lang];
    }
    async updateService(merchantId, service, image) {
        const { rows } = await _database.default.query(`Select * from service where merchant_id = $1 and id = $2`, [
            merchantId,
            service.id
        ]);
        if (!rows[0]) throw new _CustomError.CustomError('SERVICE_NOT_FOUND');
        const name = service.name || rows[0].name;
        const categoryId = service.categoryId || rows[0].category_id;
        const price = service.price || rows[0].price;
        const isActive = service.isActive || rows[0].is_active;
        console.log(rows[0].image_url);
        if (image || service.deleteImage) {
            await this.fileUploader.deleteFile(`${rows[0].image_url}`);
            if (image) {
                const uploadPath = await this.fileUploader.uploadFile(image, `${rows[0].id}.${image.name.split('.').pop()}`);
                await _database.default.query(`Update service set image_url = $1 where id = $2`, [
                    uploadPath,
                    service.id
                ]);
            } else {
                await _database.default.query(`Update service set image_url = $1 where id = $2`, [
                    null,
                    service.id
                ]);
            }
        }
        await _database.default.query(`Update service set name = $1, price = $2, category_id = $3,is_active = $4 where id = $5`, [
            name,
            price,
            categoryId,
            isActive,
            service.id
        ]);
    }
    constructor(){
        _define_property(this, "fileUploader", void 0);
        this.fileUploader = new _imageStorage.FileUploader('eu-north-1', 'image-24');
    }
};
ServiceService = _ts_decorate([
    (0, _typedi.Service)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [])
], ServiceService);

//# sourceMappingURL=service.service.js.map