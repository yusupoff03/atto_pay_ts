"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionRoute = void 0;
const express_1 = require("express");
const transaction_controller_1 = require("../controllers/transaction.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
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
    }
}
exports.TransactionRoute = TransactionRoute;
//# sourceMappingURL=transaction.route.js.map