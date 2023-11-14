"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionController = void 0;
const jsonwebtoken_1 = require("jsonwebtoken");
const _config_1 = require("../config");
const typedi_1 = require("typedi");
const transaction_service_1 = require("../services/transaction.service");
class TransactionController {
    constructor() {
        this.transaction = typedi_1.Container.get(transaction_service_1.TransactionService);
        this.pay = async (req, res, next) => {
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
                    message,
                });
            }
            catch (error) {
                next(error);
            }
        };
        this.transferToSelf = async (req, res, next) => {
            try {
                const customerId = await this.getCustomerId(req);
                const { fromCardId, toCardId, amount } = req.body;
                const lang = req.acceptsLanguages('en', 'ru', 'uz') || 'en';
                const { success_message, transferId } = await this.transaction.transferMoneyToSelf(customerId, fromCardId, toCardId, amount);
                const message = success_message[lang];
                res.status(200).json({
                    success: true,
                    transferId,
                    message,
                });
            }
            catch (error) {
                next(error);
            }
        };
        this.transferMoney = async (req, res, next) => {
            try {
                const customerId = await this.getCustomerId(req);
                const { toCardPan, fromCardId, amount } = req.body;
                const lang = req.acceptsLanguages('en', 'ru', 'uz') || 'en';
                const { transfer_id, message } = await this.transaction.transferMoney(customerId, fromCardId, toCardPan, amount, lang);
                res.status(200).json({ success: true, transfer_id, message });
            }
            catch (error) {
                next(error);
            }
        };
        this.getCustomerTransactions = async (req, res, next) => {
            try {
                const customerId = await this.getCustomerId(req);
                const { offset, fromDate, toDate, byCardId = null, byServiceId = null, page, limit } = req.body;
                const transactions = await this.transaction.getTransactions(customerId, offset, fromDate, toDate, byCardId, byServiceId, page, limit);
                res.status(200).json({ length: transactions.length, transactions });
            }
            catch (error) {
                next(error);
            }
        };
        this.getCustomerId = async (req) => {
            const cookie = req.headers.authorization;
            const decodedToken = (0, jsonwebtoken_1.verify)(cookie, _config_1.SECRET_KEY);
            return decodedToken.id;
        };
    }
}
exports.TransactionController = TransactionController;
//# sourceMappingURL=transaction.controller.js.map