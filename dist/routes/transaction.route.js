"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "TransactionRoute", {
    enumerable: true,
    get: function() {
        return TransactionRoute;
    }
});
const _express = require("express");
const _transactioncontroller = require("../controllers/transaction.controller");
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
let TransactionRoute = class TransactionRoute {
    initializeRoutes() {
        this.router.post(`${this.path}/pay`, _authmiddleware.AuthMiddleware, this.transaction.pay);
        this.router.post(`${this.path}/transfer/self`, _authmiddleware.AuthMiddleware, this.transaction.transferToSelf);
        this.router.post(`${this.path}`, _authmiddleware.AuthMiddleware, this.transaction.getCustomerTransactions);
    }
    constructor(){
        _define_property(this, "path", '/transaction');
        _define_property(this, "router", (0, _express.Router)());
        _define_property(this, "transaction", new _transactioncontroller.TransactionController());
        this.initializeRoutes();
    }
};

//# sourceMappingURL=transaction.route.js.map