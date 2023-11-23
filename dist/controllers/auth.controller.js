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
const _customersservice = require("../services/customers.service");
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
                const info = await _customersservice.CustomerService.getDeviceInfo(req);
                const { token, customer } = await this.auth.signup(customerData, info, trust, uid);
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
                const deviceInfo = await _customersservice.CustomerService.getDeviceInfo(req);
                const { tokenData, findCustomer } = await this.auth.login(customerData, deviceId, deviceInfo);
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
                const { password, otp, timeLeft } = await this.auth.getLoginType(phone, deviceId);
                res.status(200).json({
                    password: password,
                    otp: otp,
                    timeLeft: timeLeft
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
                const newEmail = merchantData.email.toLowerCase();
                const { otp } = req.body;
                const { tokenData, merchant } = await this.auth.signUpMerchant(merchantData, newEmail, otp);
                res.status(201).json({
                    token: tokenData.token,
                    data: merchant
                });
            } catch (error) {
                next(error);
            }
        });
        _define_property(this, "sendCode", async (req, res, next)=>{
            try {
                const { email, resend } = req.body;
                const newEmail = email.toLowerCase();
                const timeLeft = await this.auth.sendCode(newEmail, resend);
                console.log(timeLeft);
                res.status(200).json({
                    success: true,
                    timeLeft: timeLeft
                });
            } catch (error) {
                next(error);
            }
        });
        _define_property(this, "loginMerchant", async (req, res, next)=>{
            try {
                const { email, password } = req.body;
                const newEmail = email.toLowerCase();
                const deviceId = req.headers['x-device-id'];
                const { merchant, tokenData } = await this.auth.loginMerchant(newEmail, password, deviceId);
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