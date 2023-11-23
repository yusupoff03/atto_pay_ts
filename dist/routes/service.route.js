"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceRoute = void 0;
const express_1 = require("express");
const service_controller_1 = require("@controllers/service.controller");
const auth_middleware_1 = require("@middlewares/auth.middleware");
class ServiceRoute {
    constructor() {
        this.path = '/service';
        this.router = (0, express_1.Router)();
        this.service = new service_controller_1.ServiceController();
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.get(`${this.path}/merchant`, auth_middleware_1.AuthMiddleware, this.service.getMerchantServices);
        this.router.get(`${this.path}`, auth_middleware_1.AuthMiddleware, this.service.getAllServices);
        this.router.get(`${this.path}/qr/:key`, this.service.getOneByQR);
        this.router.get(`${this.path}/public/:id`, this.service.getOnePublicById);
        this.router.get(`${this.path}/:id`, auth_middleware_1.AuthMiddleware, this.service.getOneById);
        this.router.delete(`${this.path}`, auth_middleware_1.AuthMiddleware, this.service.deleteOneById);
        this.router.put(`${this.path}`, auth_middleware_1.AuthMiddleware, this.service.editService);
        this.router.post(`${this.path}`, auth_middleware_1.AuthMiddleware, this.service.createService);
    }
}
exports.ServiceRoute = ServiceRoute;
//# sourceMappingURL=service.route.js.map