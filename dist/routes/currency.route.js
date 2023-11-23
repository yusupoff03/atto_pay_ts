"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "CurrencyRoute", {
    enumerable: true,
    get: function() {
        return CurrencyRoute;
    }
});
const _express = require("express");
const _currencycontroller = require("../controllers/currency.controller");
const _validationmiddleware = require("../middlewares/validation.middleware");
const _currencydto = require("../dtos/currency.dto");
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
let CurrencyRoute = class CurrencyRoute {
    initializeRoutes() {
        this.router.get(`${this.path}`, this.currency.getCurrency);
        this.router.post(`${this.path}`, (0, _validationmiddleware.ValidationMiddleware)(_currencydto.CurrencyCreateDto), this.currency.createCurrency);
        this.router.put(`${this.path}`, (0, _validationmiddleware.ValidationMiddleware)(_currencydto.CurrencyUpdateDto), this.currency.updateCurrency);
        this.router.delete(`${this.path}`, this.currency.deleteCurrency);
    }
    constructor(){
        _define_property(this, "path", void 0);
        _define_property(this, "router", (0, _express.Router)());
        _define_property(this, "currency", new _currencycontroller.CurrencyController());
        this.initializeRoutes();
    }
};

//# sourceMappingURL=currency.route.js.map