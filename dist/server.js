"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _app = require("./app");
const _authroute = require("./routes/auth.route");
const _customersroute = require("./routes/customers.route");
const _cardsroute = require("./routes/cards.route");
const _validateEnv = require("./utils/validateEnv");
const _currencyroute = require("./routes/currency.route");
const _categoryroute = require("./routes/category.route");
const _merchantroute = require("./routes/merchant.route");
const _serviceroute = require("./routes/service.route");
const _transactionroute = require("./routes/transaction.route");
const _http = /*#__PURE__*/ _interop_require_default(require("http"));
const _socket = /*#__PURE__*/ _interop_require_default(require("./socket/socket"));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
(0, _validateEnv.ValidateEnv)();
const app = new _app.App([
    new _authroute.AuthRoute(),
    new _customersroute.CustomersRoute(),
    new _cardsroute.CardsRoute(),
    new _currencyroute.CurrencyRoute(),
    new _categoryroute.CategoryRoute(),
    new _merchantroute.MerchantRoute(),
    new _serviceroute.ServiceRoute(),
    new _transactionroute.TransactionRoute()
]);
const server = _http.default.createServer(app.getServer());
_socket.default.attach(server);
console.log('Server is up');
server.listen(3000);

//# sourceMappingURL=server.js.map
