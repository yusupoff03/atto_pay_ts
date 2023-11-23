"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomersRoute = void 0;
const express_1 = require("express");
const customers_controller_1 = require("@controllers/customers.controller");
const customer_dto_1 = require("@dtos/customer.dto");
const validation_middleware_1 = require("@middlewares/validation.middleware");
const auth_controller_1 = require("@controllers/auth.controller");
const auth_middleware_1 = require("@middlewares/auth.middleware");
class CustomersRoute {
    constructor() {
        this.path = '/customer';
        this.router = (0, express_1.Router)();
        this.customer = new customers_controller_1.CustomersController();
        this.auth = new auth_controller_1.AuthController();
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.get(`${this.path}/profile`, auth_middleware_1.AuthMiddleware, this.customer.getCustomerById);
        this.router.get(`${this.path}/get-otp`, this.customer.getOtp);
        this.router.get(`${this.path}/device`, auth_middleware_1.AuthMiddleware, this.customer.getDevices);
        this.router.post(`${this.path}/register`, (0, validation_middleware_1.ValidationMiddleware)(customer_dto_1.CreateCustomerDto), this.auth.signUp);
        this.router.post(`${this.path}/services`, auth_middleware_1.AuthMiddleware, this.customer.addServiceToSaved);
        this.router.post(`${this.path}/login`, (0, validation_middleware_1.ValidationMiddleware)(customer_dto_1.CustomerLoginDto), this.auth.logIn);
        this.router.post(`${this.path}/getlogin`, (0, validation_middleware_1.ValidationMiddleware)(customer_dto_1.LoginTypeDto), this.auth.getCustomerLoginType);
        this.router.post(`${this.path}/login/qr`, (0, validation_middleware_1.ValidationMiddleware)(customer_dto_1.LoginQr), this.customer.loginWithQr);
        this.router.post(`${this.path}/sendcode`, (0, validation_middleware_1.ValidationMiddleware)(customer_dto_1.VerifyDto), this.customer.sendCodeToPhone);
        this.router.put(`${this.path}/profile`, auth_middleware_1.AuthMiddleware, (0, validation_middleware_1.ValidationMiddleware)(customer_dto_1.UpdateCustomerDto), this.customer.updateCustomer);
        this.router.put(`${this.path}/lang`, auth_middleware_1.AuthMiddleware, this.customer.updateCustomerLang);
        this.router.delete(`${this.path}/services`, auth_middleware_1.AuthMiddleware, this.customer.deleteServiceFromSaved);
        this.router.delete(`${this.path}/delete`, auth_middleware_1.AuthMiddleware, this.customer.deleteCustomer);
        this.router.delete(`${this.path}/device`, auth_middleware_1.AuthMiddleware, this.customer.deleteCustomerDevice);
    }
}
exports.CustomersRoute = CustomersRoute;
//# sourceMappingURL=customers.route.js.map