"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionRoute = void 0;
const express_1 = require("express");
const transaction_controller_1 = require("@controllers/transaction.controller");
const auth_middleware_1 = require("@middlewares/auth.middleware");
const validation_middleware_1 = require("@middlewares/validation.middleware");
const transaction_dto_1 = require("@dtos/transaction.dto");
class TransactionRoute {
    constructor() {
        this.path = '/transaction';
        this.router = (0, express_1.Router)();
        this.transaction = new transaction_controller_1.TransactionController();
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.post(`${this.path}/pay`, auth_middleware_1.AuthMiddleware, this.transaction.pay);
        this.router.post(`${this.path}/transfer/self`, auth_middleware_1.AuthMiddleware, this.transaction.transferToSelf);
        this.router.post(`${this.path}`, auth_middleware_1.AuthMiddleware, this.transaction.getCustomerTransactions);
        this.router.post(`${this.path}/transfer`, auth_middleware_1.AuthMiddleware, (0, validation_middleware_1.ValidationMiddleware)(transaction_dto_1.TransferMoneyDto), this.transaction.transferMoney);
    }
}
exports.TransactionRoute = TransactionRoute;
//# sourceMappingURL=transaction.route.js.map