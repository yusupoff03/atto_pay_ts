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
const _base64url = /*#__PURE__*/ _interop_require_default(require("base64url"));
const _crypto = /*#__PURE__*/ _interop_require_wildcard(require("crypto"));
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
function _getRequireWildcardCache(nodeInterop) {
    if (typeof WeakMap !== "function") return null;
    var cacheBabelInterop = new WeakMap();
    var cacheNodeInterop = new WeakMap();
    return (_getRequireWildcardCache = function(nodeInterop) {
        return nodeInterop ? cacheNodeInterop : cacheBabelInterop;
    })(nodeInterop);
}
function _interop_require_wildcard(obj, nodeInterop) {
    if (!nodeInterop && obj && obj.__esModule) {
        return obj;
    }
    if (obj === null || typeof obj !== "object" && typeof obj !== "function") {
        return {
            default: obj
        };
    }
    var cache = _getRequireWildcardCache(nodeInterop);
    if (cache && cache.has(obj)) {
        return cache.get(obj);
    }
    var newObj = {};
    var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;
    for(var key in obj){
        if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) {
            var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;
            if (desc && (desc.get || desc.set)) {
                Object.defineProperty(newObj, key, desc);
            } else {
                newObj[key] = obj[key];
            }
        }
    }
    newObj.default = obj;
    if (cache) {
        cache.set(obj, newObj);
    }
    return newObj;
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
        const { name, merchant_id, categoryId, isActive } = serviceData;
        const { rows } = await _database.default.query(`Select * from service where merchant_id=$1 and category_id=$2 and deleted = false`, [
            merchant_id,
            categoryId
        ]);
        if (rows[0]) throw new _CustomError.CustomError('SERVICE_ALREADY_EXISTS');
        const newActive = isActive || false;
        const public_key = (0, _base64url.default)(_crypto.randomBytes(16));
        const { rows: services } = await _database.default.query(`call create_service($1, $2, $3, $4, $5, $6, null, null, null)`, [
            merchant_id,
            categoryId,
            name,
            newActive,
            public_key,
            serviceData.fields
        ]);
        const { error_code, error_message, success_message } = services[0];
        if (error_code) throw new _CustomError.CustomError(error_code, error_message);
        const { rows: created } = await _database.default.query(`Select * from service where merchant_id = $1 and category_id=$2 and deleted = false`, [
            merchant_id,
            categoryId
        ]);
        console.log(created);
        const service = created[0];
        console.log(service);
        if (image) {
            const uploadPath = await this.fileUploader.uploadFile(image, `${service.id}.${image.name.split('.').pop()}`);
            if (uploadPath) await _database.default.query(`Update service set image_url = $1 where id = $2`, [
                uploadPath,
                service.id
            ]);
        }
        if (services[0]) {
            return success_message[lang];
        }
        throw new _CustomError.CustomError('DATABASE_ERROR');
    }
    async getMerchantServices(merchantId, lang) {
        const { rows } = await _database.default.query(`
        select s.id, s.merchant_id, s.category_id, s.name, s.image_url, s.is_active,
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
        const { rows } = await _database.default.query(`select s.id, s.merchant_id, s.category_id, s.name, s.image_url,
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
        const { rows: saved } = await _database.default.query(`select service_id as id
                                            from customer_saved_service
                                            where customer_id = $1`, [
            customerId
        ]);
        if (saved[0]) {
            services.forEach((service)=>{
                saved.forEach((save)=>{
                    if (service.id === save.id) {
                        service.saved = true;
                    }
                });
            });
        }
        return services;
    }
    async getOneById(merchantId, serviceId, lang) {
        const { rows } = await _database.default.query(`
        select s.id, s.merchant_id, s.category_id, s.name, s.image_url, s.is_active, s.public_key,
               c.code as category_code, c.name -> $3 as category_name,
               (select json_agg(
                         json_build_object('id', f.id, 'name', f.name, 'type', f.type, 'order', f.order_num)
                         ) from service_field f where f.service_id = s.id) as fields
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
    async updateService(merchantId, service, lang, image) {
        const { rows } = await _database.default.query(`Select * from service where merchant_id = $1 and id = $2`, [
            merchantId,
            service.id
        ]);
        if (!rows[0]) throw new _CustomError.CustomError('SERVICE_NOT_FOUND');
        const name = service.name || rows[0].name;
        const categoryId = service.categoryId || rows[0].category_id;
        const isActive = service.isActive || rows[0].is_active;
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
        const { rows: message } = await _database.default.query(`Update service set name = $1, category_id = $2,is_active = $3 where id = $4 returning (select message from message where name = 'SERVICE_UPDATED')`, [
            name,
            categoryId,
            isActive,
            service.id
        ]);
        return message[0].message[lang];
    }
    async getOneByQr(key) {
        const { rows } = await _database.default.query(`Select id, is_active from service where public_key = $1`, [
            key
        ]);
        if (!rows[0]) throw new _CustomError.CustomError('SERVICE_NOT_FOUND');
        if (!rows[0].is_active) throw new _CustomError.CustomError('SERVICE_NOT_ACTIVE');
        console.log(rows[0].id);
        return rows[0].id;
    }
    async getOnePublicById(id, lang) {
        const { rows } = await _database.default.query(`select s.id, s.merchant_id, s.category_id, s.name, s.image_url,
              c.code as category_code, c.name -> $2 as category_name,
              (select json_agg(
                        json_build_object('id', f.id, 'name', f.name, 'type', f.type, 'order', f.order_num)
                        ) from service_field f where f.service_id = s.id) as fields
       from service s
              JOIN service_category c on s.category_id = c.id
       where s.id = $1 and s.deleted = false and s.is_active = true`, [
            id,
            lang
        ]);
        if (!rows[0]) throw new _CustomError.CustomError('SERVICE_NOT_FOUND');
        rows[0].image_url = _imageStorage.FileUploader.getUrl(rows[0].image_url);
        return rows[0];
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