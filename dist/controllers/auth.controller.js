"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const typedi_1 = require("typedi");
const auth_service_1 = require("@services/auth.service");
const customers_service_1 = require("@services/customers.service");
class AuthController {
    constructor() {
        this.auth = typedi_1.Container.get(auth_service_1.AuthService);
        this.signUp = async (req, res, next) => {
            try {
                const customerData = req.body;
                const trust = req.body.trust || false;
                const uid = req.headers['x-device-id'];
                const info = await customers_service_1.CustomerService.getDeviceInfo(req);
                const { token, customer } = await this.auth.signup(customerData, info, trust, uid);
                res.status(201).json({ token: token, data: customer, message: 'signup' });
            }
            catch (error) {
                next(error);
            }
        };
        this.logIn = async (req, res, next) => {
            try {
                const customerData = req.body;
                const deviceId = req.headers['x-device-id'];
                const deviceInfo = await customers_service_1.CustomerService.getDeviceInfo(req);
                const { tokenData, findCustomer } = await this.auth.login(customerData, deviceId, deviceInfo);
                res.status(200).json({ token: tokenData.token, data: findCustomer, message: 'login' });
            }
            catch (error) {
                next(error);
            }
        };
        this.getCustomerLoginType = async (req, res, next) => {
            try {
                const { phone } = req.body;
                const deviceId = req.headers['x-device-id'];
                const { password, otp, timeLeft } = await this.auth.getLoginType(phone, deviceId);
                res.status(200).json({
                    password: password,
                    otp: otp,
                    timeLeft: timeLeft,
                });
            }
            catch (error) {
                next(error);
            }
        };
        this.logOut = async (req, res, next) => {
            try {
                const customerData = req.customer;
                const logOutCustomerData = await this.auth.logout(customerData);
                res.status(200).json({ data: logOutCustomerData, message: 'logout' });
            }
            catch (error) {
                next(error);
            }
        };
        this.signUpMerchant = async (req, res, next) => {
            try {
                const merchantData = req.body;
                const newEmail = merchantData.email.toLowerCase();
                const { otp } = req.body;
                const { tokenData, merchant } = await this.auth.signUpMerchant(merchantData, newEmail, otp);
                res.status(201).json({ token: tokenData.token, data: merchant });
            }
            catch (error) {
                next(error);
            }
        };
        this.sendCode = async (req, res, next) => {
            try {
                const { email, resend } = req.body;
                const newEmail = email.toLowerCase();
                const timeLeft = await this.auth.sendCode(newEmail, resend);
                console.log(timeLeft);
                res.status(200).json({ success: true, timeLeft: timeLeft });
            }
            catch (error) {
                next(error);
            }
        };
        this.loginMerchant = async (req, res, next) => {
            try {
                const { email, password } = req.body;
                const newEmail = email.toLowerCase();
                const deviceId = req.headers['x-device-id'];
                const { merchant, tokenData } = await this.auth.loginMerchant(newEmail, password, deviceId);
                res.status(200).json({ token: tokenData.token, merchant: merchant });
            }
            catch (error) {
                next(error);
            }
        };
    }
}
exports.AuthController = AuthController;
//# sourceMappingURL=auth.controller.js.map