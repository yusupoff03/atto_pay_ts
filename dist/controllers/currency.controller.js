"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CurrencyController = void 0;
const typedi_1 = require("typedi");
const currency_service_1 = require("@services/currency,service");
class CurrencyController {
    constructor() {
        this.currency = typedi_1.Container.get(currency_service_1.CurrencyService);
        this.getCurrency = async (req, res, next) => {
            try {
                const { id } = req.body;
                const currency = await this.currency.getCurrencyById(id);
                res.status(200).json({
                    data: currency[0],
                });
            }
            catch (error) {
                next(error);
            }
        };
        this.createCurrency = async (req, res, next) => {
            try {
                const currencyDto = req.body;
                const currency = await this.currency.createCurrency(currencyDto);
                res.status(201).json({
                    data: currency,
                });
            }
            catch (error) {
                next(error);
            }
        };
        this.updateCurrency = async (req, res, next) => {
            try {
                const currencyUpdateDto = req.body;
                const currency = await this.currency.updateCurrency(currencyUpdateDto);
                res.status(201).json({
                    data: currency,
                });
            }
            catch (error) {
                next(error);
            }
        };
        this.deleteCurrency = async (req, res, next) => {
            try {
                const { id } = req.body;
                await this.currency.deleteCurrency(id);
                res.status(202).json({
                    message: 'Deleted',
                });
            }
            catch (error) {
                next(error);
            }
        };
    }
}
exports.CurrencyController = CurrencyController;
//# sourceMappingURL=currency.controller.js.map