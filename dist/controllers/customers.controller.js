"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomersController = void 0;
const typedi_1 = require("typedi");
const customers_service_1 = require("@services/customers.service");
const _config_1 = require("@config");
const jsonwebtoken_1 = require("jsonwebtoken");
const imageStorage_1 = require("@utils/imageStorage");
class CustomersController {
    constructor() {
        this.customer = typedi_1.Container.get(customers_service_1.CustomerService);
        this.loginWithQr = async (req, res, next) => {
            try {
                const qrLogin = req.body;
                const customerId = this.getCustomerId(req);
                await this.customer.loginWithQr(qrLogin, customerId);
                res.status(200).json({
                    success: true,
                });
            }
            catch (error) {
                next(error);
            }
        };
        this.getCustomerById = async (req, res, next) => {
            try {
                const customerId = this.getCustomerId(req);
                const customer = await this.customer.findCustomerById(customerId);
                customer.image_url = imageStorage_1.FileUploader.getUrl(customer.image_url);
                res.status(200).json(customer);
            }
            catch (error) {
                next(error);
            }
        };
        this.addServiceToSaved = async (req, res, next) => {
            try {
                const customerId = this.getCustomerId(req);
                const { serviceId: id } = req.body;
                await this.customer.addToSaved(customerId, id);
                res.status(200).json({
                    success: true,
                });
            }
            catch (error) {
                next(error);
            }
        };
        this.deleteServiceFromSaved = async (req, res, next) => {
            try {
                const customerId = this.getCustomerId(req);
                const { serviceId } = req.body;
                await this.customer.deleteFromSaved(customerId, serviceId);
                res.status(200).json({
                    success: true,
                });
            }
            catch (error) {
                next(error);
            }
        };
        this.updateCustomer = async (req, res, next) => {
            var _a;
            try {
                const customerData = req.body;
                const customerId = this.getCustomerId(req);
                const updateCustomerData = await this.customer.updateCustomer(customerId, customerData, (_a = req.files) === null || _a === void 0 ? void 0 : _a.avatar);
                res.status(200).json({ data: updateCustomerData, message: 'updated' });
            }
            catch (error) {
                next(error);
            }
        };
        this.updateCustomerLang = async (req, res, next) => {
            try {
                const customerId = this.getCustomerId(req);
                const { lang } = req.body;
                await this.customer.updateCustomerLang(customerId, lang);
                res.status(200).json({ success: true });
            }
            catch (error) {
                next(error);
            }
        };
        this.deleteCustomer = async (req, res, next) => {
            try {
                const cookie = req.cookies['Authorization'];
                const { customerId } = req.body;
                console.log(customerId);
                const decodedToken = (0, jsonwebtoken_1.verify)(cookie, _config_1.SECRET_KEY);
                const customerId2 = decodedToken.id;
                if (customerId !== customerId2) {
                    res.status(401).json({
                        message: `Unexpected token`,
                    });
                    return;
                }
                const deleteCustomerData = await this.customer.deleteCustomer(customerId);
                res.status(200).json({ data: deleteCustomerData, message: 'deleted' });
            }
            catch (error) {
                next(error);
            }
        };
        this.getOtp = async (req, res, next) => {
            try {
                const { phone } = req.body;
                const otp = await this.customer.getOtp(phone);
                res.status(200).json({
                    otp: otp,
                });
            }
            catch (error) {
                next(error);
            }
        };
        this.getDevices = async (req, res, next) => {
            try {
                const customerId = this.getCustomerId(req);
                const rows = await this.customer.getDevices(customerId);
                res.status(200).json({
                    success: true,
                    rows,
                });
            }
            catch (error) {
                next(error);
            }
        };
        this.deleteCustomerDevice = async (req, res, next) => {
            try {
                const deviceId = req.headers['x-device-id'];
                const customerId = this.getCustomerId(req);
                const lang = req.acceptsLanguages('en', 'ru', 'uz') || 'en';
                console.log(deviceId);
                const message = await this.customer.deleteCustomerDevice(deviceId, customerId, lang);
                res.status(200).json({
                    success: true,
                    message,
                });
            }
            catch (error) {
                next(error);
            }
        };
        this.sendCodeToPhone = async (req, res, next) => {
            try {
                const deviceId = req.headers['x-device-id'];
                const verify = req.body;
                await this.customer.sendCodeToPhone(verify, deviceId, true);
                res.status(200).json({
                    success: true,
                    timeLeft: 120,
                });
            }
            catch (error) {
                next(error);
            }
        };
        this.getCustomerId = (req) => {
            const cookie = req.headers.authorization;
            const decodedToken = (0, jsonwebtoken_1.verify)(cookie, _config_1.SECRET_KEY);
            return decodedToken.id;
        };
    }
}
exports.CustomersController = CustomersController;
//# sourceMappingURL=customers.controller.js.map