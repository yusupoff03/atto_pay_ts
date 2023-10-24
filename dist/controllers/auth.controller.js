"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "AuthController", {
    enumerable: true,
    get: function() {
        return AuthController;
    }
});
const _typedi = require("typedi");
const _authservice = require("../services/auth.service");
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
let AuthController = class AuthController {
    constructor(){
        _define_property(this, "auth", _typedi.Container.get(_authservice.AuthService));
        _define_property(this, "signUp", async (req, res, next)=>{
            try {
                const customerData = req.body;
                const trust = req.body.trust || false;
                const uid = req.headers['x-device-id'];
                const { cookie, token, customer } = await this.auth.signup(customerData, trust, uid);
                res.setHeader('Set-Cookie', [
                    cookie
                ]);
                res.status(201).json({
                    token: token,
                    data: customer,
                    message: 'signup'
                });
            } catch (error) {
                next(error);
            }
        });
        _define_property(this, "logIn", async (req, res, next)=>{
            try {
                const customerData = req.body;
                const deviceId = req.headers['x-device-id'];
                const { tokenData, findCustomer } = await this.auth.login(customerData, deviceId);
                res.status(200).json({
                    token: tokenData.token,
                    data: findCustomer,
                    message: 'login'
                });
            } catch (error) {
                next(error);
            }
        });
        _define_property(this, "getCustomerLoginType", async (req, res, next)=>{
            try {
                const { phone } = req.body;
                const deviceId = req.headers['x-device-id'];
                if (!phone) {
                    throw new _httpException.HttpException(400, 'Phone required');
                }
                const { password, otp } = await this.auth.getLoginType(phone, deviceId);
                res.status(200).json({
                    password: password,
                    otp: otp
                });
            } catch (error) {
                next(error);
            }
        });
        _define_property(this, "logOut", async (req, res, next)=>{
            try {
                const customerData = req.customer;
                const logOutCustomerData = await this.auth.logout(customerData);
                res.status(200).json({
                    data: logOutCustomerData,
                    message: 'logout'
                });
            } catch (error) {
                next(error);
            }
        });
        _define_property(this, "signUpMerchant", async (req, res, next)=>{
            try {
                const merchantData = req.body;
                const { cookie, tokenData, merchant } = await this.auth.signUpMerchant(merchantData);
                res.setHeader('Set-Cookie', [
                    cookie
                ]);
                res.status(201).json({
                    token: tokenData.token,
                    data: merchant
                });
            } catch (error) {
                next(error);
            }
        });
        _define_property(this, "loginMerchant", async (req, res, next)=>{
            try {
                const merchantData = req.body;
                const { merchant, cookie, tokenData } = await this.auth.loginMerchant(merchantData);
                res.setHeader('Set-Cookie', cookie);
                res.status(200).json({
                    token: tokenData.token,
                    merchant: merchant
                });
            } catch (error) {
                next(error);
            }
        });
    }
};

//# sourceMappingURL=auth.controller.js.map