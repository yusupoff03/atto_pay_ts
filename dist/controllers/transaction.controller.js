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
                const { serviceId, fromCardId } = req.body;
                const customerId = await this.getCustomerId(req);
                const paymentId = await this.transaction.payForService(customerId, serviceId, fromCardId);
                res.status(200).json({
                    success: true,
                    paymentId,
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
                const transferId = await this.transaction.transferMoneyToSelf(customerId, fromCardId, toCardId, amount);
                res.status(200).json({
                    success: true,
                    transferId,
                });
            }
            catch (error) {
                next(error);
            }
        };
        this.getCustomerTransactions = async (req, res, next) => {
            try {
                const customerId = await this.getCustomerId(req);
                const { offset, fromDate, toDate, byCardId = null, byServiceId = null } = req.body;
                const transactions = await this.transaction.getTransactions(customerId, offset, fromDate, toDate, byCardId, byServiceId);
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