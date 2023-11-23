"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "CurrencyController", {
    enumerable: true,
    get: function() {
        return CurrencyController;
    }
});
const _typedi = require("typedi");
const _currencyservice = require("../services/currency,service");
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
let CurrencyController = class CurrencyController {
    constructor(){
        _define_property(this, "currency", _typedi.Container.get(_currencyservice.CurrencyService));
        _define_property(this, "getCurrency", async (req, res, next)=>{
            try {
                const { id } = req.body;
                const currency = await this.currency.getCurrencyById(id);
                res.status(200).json({
                    data: currency[0]
                });
            } catch (error) {
                next(error);
            }
        });
        _define_property(this, "createCurrency", async (req, res, next)=>{
            try {
                const currencyDto = req.body;
                const currency = await this.currency.createCurrency(currencyDto);
                res.status(201).json({
                    data: currency
                });
            } catch (error) {
                next(error);
            }
        });
        _define_property(this, "updateCurrency", async (req, res, next)=>{
            try {
                const currencyUpdateDto = req.body;
                const currency = await this.currency.updateCurrency(currencyUpdateDto);
                res.status(201).json({
                    data: currency
                });
            } catch (error) {
                next(error);
            }
        });
        _define_property(this, "deleteCurrency", async (req, res, next)=>{
            try {
                const { id } = req.body;
                await this.currency.deleteCurrency(id);
                res.status(202).json({
                    message: 'Deleted'
                });
            } catch (error) {
                next(error);
            }
        });
    }
};

//# sourceMappingURL=currency.controller.js.map