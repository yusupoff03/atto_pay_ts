"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "TransactionController", {
    enumerable: true,
    get: function() {
        return TransactionController;
    }
});
const _jsonwebtoken = require("jsonwebtoken");
const _config = require("../config");
const _typedi = require("typedi");
const _transactionservice = require("../services/transaction.service");
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
let TransactionController = class TransactionController {
    constructor(){
        _define_property(this, "transaction", _typedi.Container.get(_transactionservice.TransactionService));
        _define_property(this, "pay", async (req, res, next)=>{
            try {
                const { serviceId, fromCardId, amount, fields } = req.body;
                const customerId = await this.getCustomerId(req);
                const lang = req.acceptsLanguages('en', 'ru', 'uz') || 'en';
                const { success_message, id } = await this.transaction.payForService(customerId, serviceId, fromCardId, amount, fields);
                const message = success_message[lang];
                console.log(success_message);
                res.status(200).json({
                    success: true,
                    id,
                    message
                });
            } catch (error) {
                next(error);
            }
        });
        _define_property(this, "transferToSelf", async (req, res, next)=>{
            try {
                const customerId = await this.getCustomerId(req);
                const { fromCardId, toCardId, amount } = req.body;
                const lang = req.acceptsLanguages('en', 'ru', 'uz') || 'en';
                const { success_message, transferId } = await this.transaction.transferMoneyToSelf(customerId, fromCardId, toCardId, amount);
                const message = success_message[lang];
                res.status(200).json({
                    success: true,
                    transferId,
                    message
                });
            } catch (error) {
                next(error);
            }
        });
        _define_property(this, "transferMoney", async (req, res, next)=>{
            try {
                const customerId = await this.getCustomerId(req);
                const { toCardPan, fromCardId, amount } = req.body;
                const lang = req.acceptsLanguages('en', 'ru', 'uz') || 'en';
                const { transfer_id, message } = await this.transaction.transferMoney(customerId, fromCardId, toCardPan, amount, lang);
                res.status(200).json({
                    success: true,
                    transfer_id,
                    message
                });
            } catch (error) {
                next(error);
            }
        });
        _define_property(this, "getCustomerTransactions", async (req, res, next)=>{
            try {
                const customerId = await this.getCustomerId(req);
                const { offset, fromDate, toDate, byCardId = null, byServiceId = null, page, limit } = req.body;
                const transactions = await this.transaction.getTransactions(customerId, offset, fromDate, toDate, byCardId, byServiceId, page, limit);
                res.status(200).json({
                    length: transactions.length,
                    transactions
                });
            } catch (error) {
                next(error);
            }
        });
        _define_property(this, "getCustomerId", async (req)=>{
            const cookie = req.headers.authorization;
            const decodedToken = (0, _jsonwebtoken.verify)(cookie, _config.SECRET_KEY);
            return decodedToken.id;
        });
    }
};

//# sourceMappingURL=transaction.controller.js.map