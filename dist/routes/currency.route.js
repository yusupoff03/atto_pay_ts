"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CurrencyRoute = void 0;
const express_1 = require("express");
const currency_controller_1 = require("../controllers/currency.controller");
const validation_middleware_1 = require("../middlewares/validation.middleware");
const currency_dto_1 = require("../dtos/currency.dto");
class CurrencyRoute {
    constructor() {
        this.router = (0, express_1.Router)();
        this.currency = new currency_controller_1.CurrencyController();
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.get(`${this.path}`, this.currency.getCurrency);
        this.router.post(`${this.path}`, (0, validation_middleware_1.ValidationMiddleware)(currency_dto_1.CurrencyCreateDto), this.currency.createCurrency);
        this.router.put(`${this.path}`, (0, validation_middleware_1.ValidationMiddleware)(currency_dto_1.CurrencyUpdateDto), this.currency.updateCurrency);
        this.router.delete(`${this.path}`, this.currency.deleteCurrency);
    }
}
exports.CurrencyRoute = CurrencyRoute;
//# sourceMappingURL=currency.route.js.map