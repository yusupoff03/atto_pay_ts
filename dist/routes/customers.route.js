"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "CustomersRoute", {
    enumerable: true,
    get: function() {
        return CustomersRoute;
    }
});
const _express = require("express");
const _customerscontroller = require("../controllers/customers.controller");
const _customerdto = require("../dtos/customer.dto");
const _validationmiddleware = require("../middlewares/validation.middleware");
const _authcontroller = require("../controllers/auth.controller");
const _authmiddleware = require("../middlewares/auth.middleware");
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
let CustomersRoute = class CustomersRoute {
    initializeRoutes() {
        this.router.get(`${this.path}/profile`, _authmiddleware.AuthMiddleware, this.customer.getCustomerById);
        this.router.get(`${this.path}/get-otp`, this.customer.getOtp);
        this.router.get(`${this.path}/device`, _authmiddleware.AuthMiddleware, this.customer.getDevices);
        this.router.post(`${this.path}/register`, (0, _validationmiddleware.ValidationMiddleware)(_customerdto.CreateCustomerDto), this.auth.signUp);
        this.router.post(`${this.path}/services`, _authmiddleware.AuthMiddleware, this.customer.addServiceToSaved);
        this.router.post(`${this.path}/login`, (0, _validationmiddleware.ValidationMiddleware)(_customerdto.CustomerLoginDto), this.auth.logIn);
        this.router.post(`${this.path}/getlogin`, (0, _validationmiddleware.ValidationMiddleware)(_customerdto.LoginTypeDto), this.auth.getCustomerLoginType);
        this.router.post(`${this.path}/login/qr`, (0, _validationmiddleware.ValidationMiddleware)(_customerdto.LoginQr), this.customer.loginWithQr);
        this.router.post(`${this.path}/sendcode`, (0, _validationmiddleware.ValidationMiddleware)(_customerdto.VerifyDto), this.customer.sendCodeToPhone);
        this.router.put(`${this.path}/profile`, _authmiddleware.AuthMiddleware, (0, _validationmiddleware.ValidationMiddleware)(_customerdto.UpdateCustomerDto), this.customer.updateCustomer);
        this.router.put(`${this.path}/lang`, _authmiddleware.AuthMiddleware, this.customer.updateCustomerLang);
        this.router.delete(`${this.path}/services`, _authmiddleware.AuthMiddleware, this.customer.deleteServiceFromSaved);
        this.router.delete(`${this.path}/delete`, _authmiddleware.AuthMiddleware, this.customer.deleteCustomer);
        this.router.delete(`${this.path}/device`, _authmiddleware.AuthMiddleware, this.customer.deleteCustomerDevice);
    }
    constructor(){
        _define_property(this, "path", '/customer');
        _define_property(this, "router", (0, _express.Router)());
        _define_property(this, "customer", new _customerscontroller.CustomersController());
        _define_property(this, "auth", new _authcontroller.AuthController());
        this.initializeRoutes();
    }
};

//# sourceMappingURL=customers.route.js.map