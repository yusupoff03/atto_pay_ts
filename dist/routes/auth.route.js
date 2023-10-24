"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthRoute = void 0;
const express_1 = require("express");
const auth_controller_1 = require("../controllers/auth.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
class AuthRoute {
    constructor() {
        this.path = '/auth';
        this.router = (0, express_1.Router)();
        this.auth = new auth_controller_1.AuthController();
        this.initializeRoutes();
    }
    initializeRoutes() {
        // this.router.post('/register', ValidationMiddleware(CreateCustomerDto), this.auth.signUp);
        // this.router.post('/login', ValidationMiddleware(CreateCustomerDto), this.auth.logIn);
        this.router.delete('/logout', auth_middleware_1.AuthMiddleware, this.auth.logOut);
        // this.router.post('/merchant/signup', this.auth.signUpMerchant);
        // this.router.post('/merchant/login', this.auth.loginMerchant);
        this.router.get('/get-logintype', this.auth.getCustomerLoginType);
    }
}
exports.AuthRoute = AuthRoute;
//# sourceMappingURL=auth.route.js.map