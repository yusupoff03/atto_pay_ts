"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "AuthRoute", {
    enumerable: true,
    get: function() {
        return AuthRoute;
    }
});
const _express = require("express");
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
let AuthRoute = class AuthRoute {
    initializeRoutes() {
        // this.router.post('/register', ValidationMiddleware(CreateCustomerDto), this.auth.signUp);
        // this.router.post('/login', ValidationMiddleware(CreateCustomerDto), this.auth.logIn);
        this.router.delete('/logout', _authmiddleware.AuthMiddleware, this.auth.logOut);
        // this.router.post('/merchant/signup', this.auth.signUpMerchant);
        // this.router.post('/merchant/login', this.auth.loginMerchant);
        this.router.get('/get-logintype', this.auth.getCustomerLoginType);
    }
    constructor(){
        _define_property(this, "path", '/auth');
        _define_property(this, "router", (0, _express.Router)());
        _define_property(this, "auth", new _authcontroller.AuthController());
        this.initializeRoutes();
    }
};

//# sourceMappingURL=auth.route.js.map