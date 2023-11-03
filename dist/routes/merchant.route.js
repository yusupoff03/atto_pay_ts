"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MerchantRoute = void 0;
const express_1 = require("express");
const merchant_controller_1 = require("../controllers/merchant.controller");
const auth_controller_1 = require("../controllers/auth.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const validation_middleware_1 = require("../middlewares/validation.middleware");
const merchant_dto_1 = require("../dtos/merchant.dto");
class MerchantRoute {
    constructor() {
        this.path = '/merchant';
        this.router = (0, express_1.Router)();
        this.merchant = new merchant_controller_1.MerchantController();
        this.auth = new auth_controller_1.AuthController();
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.get(`${this.path}/profile`, auth_middleware_1.AuthMiddleware, this.merchant.getMerchantProfile);
        this.router.post(`${this.path}/login`, this.auth.loginMerchant);
        this.router.post(`${this.path}/send-code`, this.auth.sendCode);
        this.router.post(`${this.path}/register`, (0, validation_middleware_1.ValidationMiddleware)(merchant_dto_1.CreateMerchantDto), this.auth.signUpMerchant);
        this.router.put(`${this.path}/update`, auth_middleware_1.AuthMiddleware, this.merchant.updateMerchant);
        this.router.put(`${this.path}/lang`, auth_middleware_1.AuthMiddleware, this.merchant.updateMerchantLang);
    }
}
exports.MerchantRoute = MerchantRoute;
//# sourceMappingURL=merchant.route.js.map