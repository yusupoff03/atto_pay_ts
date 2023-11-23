"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ServiceRoute", {
    enumerable: true,
    get: function() {
        return ServiceRoute;
    }
});
const _express = require("express");
const _servicecontroller = require("../controllers/service.controller");
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
let ServiceRoute = class ServiceRoute {
    initializeRoutes() {
        this.router.get(`${this.path}/merchant`, _authmiddleware.AuthMiddleware, this.service.getMerchantServices);
        this.router.get(`${this.path}`, _authmiddleware.AuthMiddleware, this.service.getAllServices);
        this.router.get(`${this.path}/qr/:key`, this.service.getOneByQR);
        this.router.get(`${this.path}/public/:id`, this.service.getOnePublicById);
        this.router.get(`${this.path}/:id`, _authmiddleware.AuthMiddleware, this.service.getOneById);
        this.router.delete(`${this.path}`, _authmiddleware.AuthMiddleware, this.service.deleteOneById);
        this.router.put(`${this.path}`, _authmiddleware.AuthMiddleware, this.service.editService);
        this.router.post(`${this.path}`, _authmiddleware.AuthMiddleware, this.service.createService);
    }
    constructor(){
        _define_property(this, "path", '/service');
        _define_property(this, "router", (0, _express.Router)());
        _define_property(this, "service", new _servicecontroller.ServiceController());
        this.initializeRoutes();
    }
};

//# sourceMappingURL=service.route.js.map