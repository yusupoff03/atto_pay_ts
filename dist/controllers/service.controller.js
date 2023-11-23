"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ServiceController", {
    enumerable: true,
    get: function() {
        return ServiceController;
    }
});
const _jsonwebtoken = require("jsonwebtoken");
const _config = require("../config");
const _httpException = require("../exceptions/httpException");
const _serviceservice = require("../services/service.service");
const _typedi = require("typedi");
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
let ServiceController = class ServiceController {
    constructor(){
        _define_property(this, "service", _typedi.Container.get(_serviceservice.ServiceService));
        _define_property(this, "getMerchantServices", async (req, res, next)=>{
            try {
                const merchantId = await this.getMerchantId(req);
                const lang = req.acceptsLanguages();
                const services = await this.service.getMerchantServices(merchantId, lang);
                res.status(200).json({
                    count: services.length,
                    services
                });
            } catch (error) {
                next(error);
            }
        });
        _define_property(this, "deleteOneById", async (req, res, next)=>{
            try {
                const merchantId = await this.getMerchantId(req);
                const serviceId = req.body.id;
                const lang = req.acceptsLanguages('en', 'ru', 'uz') || 'en';
                const message = await this.service.deleteOneById(merchantId, serviceId, lang);
                res.status(200).json({
                    success: true,
                    message
                });
            } catch (error) {
                next(error);
            }
        });
        _define_property(this, "createService", async (req, res, next)=>{
            try {
                var _req_files;
                const merchantId = await this.getMerchantId(req);
                const service = req.body;
                const lang = req.acceptsLanguages('en', 'ru', 'uz') || 'en';
                service.merchant_id = merchantId;
                const message = await this.service.createService(service, lang, (_req_files = req.files) === null || _req_files === void 0 ? void 0 : _req_files.image);
                res.status(201).json({
                    success: true,
                    message
                });
            } catch (error) {
                next(error);
            }
        });
        _define_property(this, "getAllServices", async (req, res, next)=>{
            try {
                const lang = req.acceptsLanguages('en', 'ru', 'uz') || 'en';
                const customerId = await this.getCustomerId(req);
                const services = await this.service.getAllServices(lang, customerId);
                res.status(200).json({
                    count: services.length,
                    services
                });
            } catch (error) {
                next(error);
            }
        });
        _define_property(this, "getOneById", async (req, res, next)=>{
            try {
                const merchantId = await this.getMerchantId(req);
                const id = req.params.id;
                const lang = req.acceptsLanguages('en', 'ru', 'uz') || 'en';
                const service = await this.service.getOneById(merchantId, id, lang);
                res.status(200).json(service);
            } catch (error) {
                next(error);
            }
        });
        _define_property(this, "editService", async (req, res, next)=>{
            try {
                var _req_files;
                const merchantId = await this.getMerchantId(req);
                const lang = req.acceptsLanguages('en', 'ru', 'uz') || 'en';
                const serviceUpdate = req.body;
                const message = await this.service.updateService(merchantId, serviceUpdate, lang, (_req_files = req.files) === null || _req_files === void 0 ? void 0 : _req_files.image);
                res.status(200).json({
                    success: true,
                    message
                });
            } catch (error) {
                next(error);
            }
        });
        _define_property(this, "getOneByQR", async (req, res, next)=>{
            try {
                const { key } = req.params;
                const id = await this.service.getOneByQr(key);
                res.status(200).json({
                    id: id
                });
            } catch (error) {
                next(error);
            }
        });
        _define_property(this, "getOnePublicById", async (req, res, next)=>{
            try {
                const { id } = req.params;
                const lang = req.acceptsLanguages('en', 'ru', 'uz') || 'en';
                const service = await this.service.getOnePublicById(id, lang);
                res.status(200).json(service);
            } catch (error) {
                next(error);
            }
        });
        _define_property(this, "getMerchantId", async (req)=>{
            const token = req.headers.authorization;
            const decodedToken = (0, _jsonwebtoken.verify)(token, _config.SECRET_KEY);
            if (decodedToken.role) {
                return String(decodedToken.id);
            }
            throw new _httpException.HttpException(403, 'You dont have access to this recourse');
        });
        _define_property(this, "getCustomerId", async (req)=>{
            const cookie = req.headers.authorization;
            const decodedToken = (0, _jsonwebtoken.verify)(cookie, _config.SECRET_KEY);
            return decodedToken.id;
        });
    }
};

//# sourceMappingURL=service.controller.js.map