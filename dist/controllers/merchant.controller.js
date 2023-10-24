"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MerchantController = void 0;
const typedi_1 = require("typedi");
const merchant_service_1 = require("../services/merchant.service");
const jsonwebtoken_1 = require("jsonwebtoken");
const _config_1 = require("../config");
const httpException_1 = require("../exceptions/httpException");
class MerchantController {
    constructor() {
        this.merchant = typedi_1.Container.get(merchant_service_1.MerchantService);
        this.getMerchantProfile = async (req, res, next) => {
            try {
                const merchantId = await this.getMerchantId(req);
                console.log(merchantId);
                const merchant = await this.merchant.getMerchantById(merchantId);
                delete merchant.hashed_password;
                res.status(200).json(merchant);
            }
            catch (error) {
                next(error);
            }
        };
        this.updateMerchant = async (req, res, next) => {
            try {
                const merchantId = await this.getMerchantId(req);
                const { name, password } = req.body;
                const updateMerchantData = await this.merchant.updateMerchant(merchantId, name, password);
                res.status(200).json({
                    data: updateMerchantData,
                });
            }
            catch (error) {
                next(error);
            }
        };
        this.updateMerchantLang = async (req, res, next) => {
            try {
                const merchantId = await this.getMerchantId(req);
                const { lang } = req.body;
                await this.merchant.updateMerchantLang(merchantId, lang);
                res.status(200).json({ success: true });
            }
            catch (error) {
                next(error);
            }
        };
        this.getMerchantId = async (req) => {
            const token = req.headers.authorization;
            console.log(token);
            // const token: string = cookie.replace(/"/g, '');
            const decodedToken = (0, jsonwebtoken_1.verify)(token, _config_1.SECRET_KEY);
            if (decodedToken.role) {
                return String(decodedToken.id);
            }
            throw new httpException_1.HttpException(403, 'You dont have access to this recourse');
        };
    }
}
exports.MerchantController = MerchantController;
//# sourceMappingURL=merchant.controller.js.map