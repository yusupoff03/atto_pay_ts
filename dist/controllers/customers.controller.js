"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "CustomersController", {
    enumerable: true,
    get: function() {
        return CustomersController;
    }
});
const _typedi = require("typedi");
const _customersservice = require("../services/customers.service");
const _config = require("../config");
const _jsonwebtoken = require("jsonwebtoken");
const _imageStorage = require("../utils/imageStorage");
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
let CustomersController = class CustomersController {
    constructor(){
        _define_property(this, "customer", _typedi.Container.get(_customersservice.CustomerService));
        _define_property(this, "loginWithQr", async (req, res, next)=>{
            try {
                const qrLogin = req.body;
                const customerId = this.getCustomerId(req);
                await this.customer.loginWithQr(qrLogin, customerId);
                res.status(200).json({
                    success: true
                });
            } catch (error) {
                next(error);
            }
        });
        _define_property(this, "getCustomerById", async (req, res, next)=>{
            try {
                const customerId = this.getCustomerId(req);
                const customer = await this.customer.findCustomerById(customerId);
                customer.image_url = _imageStorage.FileUploader.getUrl(customer.image_url);
                res.status(200).json(customer);
            } catch (error) {
                next(error);
            }
        });
        _define_property(this, "addServiceToSaved", async (req, res, next)=>{
            try {
                const customerId = this.getCustomerId(req);
                const { serviceId: id } = req.body;
                await this.customer.addToSaved(customerId, id);
                res.status(200).json({
                    success: true
                });
            } catch (error) {
                next(error);
            }
        });
        _define_property(this, "deleteServiceFromSaved", async (req, res, next)=>{
            try {
                const customerId = this.getCustomerId(req);
                const { serviceId } = req.body;
                await this.customer.deleteFromSaved(customerId, serviceId);
                res.status(200).json({
                    success: true
                });
            } catch (error) {
                next(error);
            }
        });
        _define_property(this, "updateCustomer", async (req, res, next)=>{
            try {
                var _req_files;
                const customerData = req.body;
                const customerId = this.getCustomerId(req);
                const updateCustomerData = await this.customer.updateCustomer(customerId, customerData, (_req_files = req.files) === null || _req_files === void 0 ? void 0 : _req_files.avatar);
                res.status(200).json({
                    data: updateCustomerData,
                    message: 'updated'
                });
            } catch (error) {
                next(error);
            }
        });
        _define_property(this, "updateCustomerLang", async (req, res, next)=>{
            try {
                const customerId = this.getCustomerId(req);
                const { lang } = req.body;
                await this.customer.updateCustomerLang(customerId, lang);
                res.status(200).json({
                    success: true
                });
            } catch (error) {
                next(error);
            }
        });
        _define_property(this, "deleteCustomer", async (req, res, next)=>{
            try {
                const cookie = req.cookies['Authorization'];
                const { customerId } = req.body;
                console.log(customerId);
                const decodedToken = (0, _jsonwebtoken.verify)(cookie, _config.SECRET_KEY);
                const customerId2 = decodedToken.id;
                if (customerId !== customerId2) {
                    res.status(401).json({
                        message: `Unexpected token`
                    });
                    return;
                }
                const deleteCustomerData = await this.customer.deleteCustomer(customerId);
                res.status(200).json({
                    data: deleteCustomerData,
                    message: 'deleted'
                });
            } catch (error) {
                next(error);
            }
        });
        _define_property(this, "getOtp", async (req, res, next)=>{
            try {
                const { phone } = req.body;
                const otp = await this.customer.getOtp(phone);
                res.status(200).json({
                    otp: otp
                });
            } catch (error) {
                next(error);
            }
        });
        _define_property(this, "getDevices", async (req, res, next)=>{
            try {
                const customerId = this.getCustomerId(req);
                const rows = await this.customer.getDevices(customerId);
                res.status(200).json({
                    success: true,
                    rows
                });
            } catch (error) {
                next(error);
            }
        });
        _define_property(this, "deleteCustomerDevice", async (req, res, next)=>{
            try {
                const deviceId = req.headers['x-device-id'];
                const customerId = this.getCustomerId(req);
                const lang = req.acceptsLanguages('en', 'ru', 'uz') || 'en';
                console.log(deviceId);
                const message = await this.customer.deleteCustomerDevice(deviceId, customerId, lang);
                res.status(200).json({
                    success: true,
                    message
                });
            } catch (error) {
                next(error);
            }
        });
        _define_property(this, "sendCodeToPhone", async (req, res, next)=>{
            try {
                const deviceId = req.headers['x-device-id'];
                const verify = req.body;
                await this.customer.sendCodeToPhone(verify, deviceId, true);
                res.status(200).json({
                    success: true,
                    timeLeft: 120
                });
            } catch (error) {
                next(error);
            }
        });
        _define_property(this, "getCustomerId", (req)=>{
            const cookie = req.headers.authorization;
            const decodedToken = (0, _jsonwebtoken.verify)(cookie, _config.SECRET_KEY);
            return decodedToken.id;
        });
    }
};

//# sourceMappingURL=customers.controller.js.map