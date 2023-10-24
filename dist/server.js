"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
const auth_route_1 = require("./routes/auth.route");
const customers_route_1 = require("./routes/customers.route");
const cards_route_1 = require("./routes/cards.route");
const validateEnv_1 = require("./utils/validateEnv");
const currency_route_1 = require("./routes/currency.route");
const category_route_1 = require("./routes/category.route");
const merchant_route_1 = require("./routes/merchant.route");
const service_route_1 = require("./routes/service.route");
const transaction_route_1 = require("./routes/transaction.route");
(0, validateEnv_1.ValidateEnv)();
const app = new app_1.App([
    new auth_route_1.AuthRoute(),
    new customers_route_1.CustomersRoute(),
    new cards_route_1.CardsRoute(),
    new currency_route_1.CurrencyRoute(),
    new category_route_1.CategoryRoute(),
    new merchant_route_1.MerchantRoute(),
    new service_route_1.ServiceRoute(),
    new transaction_route_1.TransactionRoute(),
]);
console.log('Server is up');
app.listen();
//# sourceMappingURL=server.js.map