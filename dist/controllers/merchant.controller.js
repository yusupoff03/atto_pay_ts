"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "MerchantController", {
    enumerable: true,
    get: function() {
        return MerchantController;
    }
});
const _typedi = require("typedi");
const _merchantservice = require("../services/merchant.service");
const _jsonwebtoken = require("jsonwebtoken");
const _config = require("../config");
const _httpException = require("../exceptions/httpException");
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
let MerchantController = class MerchantController {
    constructor(){
        _define_property(this, "merchant", _typedi.Container.get(_merchantservice.MerchantService));
        _define_property(this, "getMerchantProfile", async (req, res, next)=>{
            try {
                const merchantId = await this.getMerchantId(req);
                console.log(merchantId);
                const merchant = await this.merchant.getMerchantById(merchantId);
                delete merchant.hashed_password;
                res.status(200).json(merchant);
            } catch (error) {
                next(error);
            }
        });
        _define_property(this, "updateMerchant", async (req, res, next)=>{
            try {
                const merchantId = await this.getMerchantId(req);
                const { name, password } = req.body;
                const updateMerchantData = await this.merchant.updateMerchant(merchantId, name, password);
                res.status(200).json({
                    data: updateMerchantData
                });
            } catch (error) {
                next(error);
            }
        });
        _define_property(this, "updateMerchantLang", async (req, res, next)=>{
            try {
                const merchantId = await this.getMerchantId(req);
                const { lang } = req.body;
                await this.merchant.updateMerchantLang(merchantId, lang);
                res.status(200).json({
                    success: true
                });
            } catch (error) {
                next(error);
            }
        });
        _define_property(this, "getMerchantId", async (req)=>{
            const token = req.headers.authorization;
            console.log(token);
            // const token: string = cookie.replace(/"/g, '');
            const decodedToken = (0, _jsonwebtoken.verify)(token, _config.SECRET_KEY);
            if (decodedToken.role) {
                return String(decodedToken.id);
            }
            throw new _httpException.HttpException(403, 'You dont have access to this recourse');
        });
    }
};

//# sourceMappingURL=merchant.controller.js.map