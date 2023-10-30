"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceController = void 0;
const jsonwebtoken_1 = require("jsonwebtoken");
const _config_1 = require("../config");
const httpException_1 = require("../exceptions/httpException");
const service_service_1 = require("../services/service.service");
const typedi_1 = require("typedi");
class ServiceController {
    constructor() {
        this.service = typedi_1.Container.get(service_service_1.ServiceService);
        this.getMerchantServices = async (req, res, next) => {
            try {
                const merchantId = await this.getMerchantId(req);
                const lang = req.acceptsLanguages();
                const services = await this.service.getMerchantServices(merchantId, lang);
                res.status(200).json({
                    count: services.length,
                    services,
                });
            }
            catch (error) {
                next(error);
            }
        };
        this.deleteOneById = async (req, res, next) => {
            try {
                const merchantId = await this.getMerchantId(req);
                const serviceId = req.body.id;
                const lang = req.acceptsLanguages('en', 'ru', 'uz') || 'en';
                const message = await this.service.deleteOneById(merchantId, serviceId, lang);
                res.status(200).json({
                    success: true,
                    message,
                });
            }
            catch (error) {
                next(error);
            }
        };
        this.createService = async (req, res, next) => {
            var _a;
            try {
                const merchantId = await this.getMerchantId(req);
                const service = req.body;
                const lang = req.acceptsLanguages('en', 'ru', 'uz') || 'en';
                service.merchant_id = merchantId;
                const message = await this.service.createService(service, lang, (_a = req.files) === null || _a === void 0 ? void 0 : _a.image);
                res.status(201).json({
                    success: true,
                    message,
                });
            }
            catch (error) {
                next(error);
            }
        };
        this.getAllServices = async (req, res, next) => {
            try {
                const lang = req.acceptsLanguages('en', 'ru', 'uz') || 'en';
                const customerId = await this.getCustomerId(req);
                const services = await this.service.getAllServices(lang, customerId);
                res.status(200).json({
                    count: services.length,
                    services,
                });
            }
            catch (error) {
                next(error);
            }
        };
        this.getOneById = async (req, res, next) => {
            try {
                const merchantId = await this.getMerchantId(req);
                const id = req.params.id;
                const lang = req.acceptsLanguages('en', 'ru', 'uz') || 'en';
                const service = await this.service.getOneById(merchantId, id, lang);
                res.status(200).json(service);
            }
            catch (error) {
                next(error);
            }
        };
        this.editService = async (req, res, next) => {
            var _a;
            try {
                const merchantId = await this.getMerchantId(req);
                const lang = req.acceptsLanguages('en', 'ru', 'uz') || 'en';
                const serviceUpdate = req.body;
                const message = await this.service.updateService(merchantId, serviceUpdate, lang, (_a = req.files) === null || _a === void 0 ? void 0 : _a.image);
                res.status(200).json({
                    success: true,
                    message,
                });
            }
            catch (error) {
                next(error);
            }
        };
        this.getMerchantId = async (req) => {
            const token = req.headers.authorization;
            const decodedToken = (0, jsonwebtoken_1.verify)(token, _config_1.SECRET_KEY);
            if (decodedToken.role) {
                return String(decodedToken.id);
            }
            throw new httpException_1.HttpException(403, 'You dont have access to this recourse');
        };
        this.getCustomerId = async (req) => {
            const cookie = req.headers.authorization;
            const decodedToken = (0, jsonwebtoken_1.verify)(cookie, _config_1.SECRET_KEY);
            return decodedToken.id;
        };
    }
}
exports.ServiceController = ServiceController;
//# sourceMappingURL=service.controller.js.map