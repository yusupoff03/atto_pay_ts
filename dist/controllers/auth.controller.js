"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const typedi_1 = require("typedi");
const auth_service_1 = require("../services/auth.service");
const httpException_1 = require("../exceptions/httpException");
class AuthController {
    constructor() {
        this.auth = typedi_1.Container.get(auth_service_1.AuthService);
        this.signUp = async (req, res, next) => {
            try {
                const customerData = req.body;
                const trust = req.body.trust || false;
                const uid = req.headers['x-device-id'];
                const { cookie, token, customer } = await this.auth.signup(customerData, trust, uid);
                res.setHeader('Set-Cookie', [cookie]);
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
                const { tokenData, findCustomer } = await this.auth.login(customerData, deviceId);
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
                if (!phone) {
                    throw new httpException_1.HttpException(400, 'Phone required');
                }
                const { password, otp } = await this.auth.getLoginType(phone, deviceId);
                res.status(200).json({
                    password: password,
                    otp: otp,
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
                const { cookie, tokenData, merchant } = await this.auth.signUpMerchant(merchantData);
                res.setHeader('Set-Cookie', [cookie]);
                res.status(201).json({ token: tokenData.token, data: merchant });
            }
            catch (error) {
                next(error);
            }
        };
        this.loginMerchant = async (req, res, next) => {
            try {
                const merchantData = req.body;
                const { merchant, cookie, tokenData } = await this.auth.loginMerchant(merchantData);
                res.setHeader('Set-Cookie', cookie);
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