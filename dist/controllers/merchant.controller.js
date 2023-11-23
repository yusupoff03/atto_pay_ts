"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MerchantController = void 0;
const typedi_1 = require("typedi");
const merchant_service_1 = require("@services/merchant.service");
const jsonwebtoken_1 = require("jsonwebtoken");
const _config_1 = require("@config");
const CustomError_1 = require("@exceptions/CustomError");
class MerchantController {
    constructor() {
        this.merchant = typedi_1.Container.get(merchant_service_1.MerchantService);
        this.getMerchantProfile = async (req, res, next) => {
            try {
                const merchantId = await this.getMerchantId(req);
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
                const { name } = req.body;
                const updateMerchantData = await this.merchant.updateMerchant(merchantId, name);
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
            const decodedToken = (0, jsonwebtoken_1.verify)(token, _config_1.SECRET_KEY);
            if (decodedToken.role) {
                return String(decodedToken.id);
            }
            throw new CustomError_1.CustomError('MISSING_TOKEN');
        };
    }
}
exports.MerchantController = MerchantController;
//# sourceMappingURL=merchant.controller.js.map