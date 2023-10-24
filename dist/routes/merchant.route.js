"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "MerchantRoute", {
    enumerable: true,
    get: function() {
        return MerchantRoute;
    }
});
const _express = require("express");
const _merchantcontroller = require("../controllers/merchant.controller");
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
let MerchantRoute = class MerchantRoute {
    initializeRoutes() {
        this.router.get(`${this.path}/profile`, _authmiddleware.AuthMiddleware, this.merchant.getMerchantProfile);
        this.router.post(`${this.path}/login`, this.auth.loginMerchant);
        this.router.post(`${this.path}/register`, this.auth.signUpMerchant);
        this.router.put(`${this.path}/update`, _authmiddleware.AuthMiddleware, this.merchant.updateMerchant);
        this.router.put(`${this.path}/lang`, _authmiddleware.AuthMiddleware, this.merchant.updateMerchantLang);
    }
    constructor(){
        _define_property(this, "path", '/merchant');
        _define_property(this, "router", (0, _express.Router)());
        _define_property(this, "merchant", new _merchantcontroller.MerchantController());
        _define_property(this, "auth", new _authcontroller.AuthController());
        this.initializeRoutes();
    }
};

//# sourceMappingURL=merchant.route.js.map