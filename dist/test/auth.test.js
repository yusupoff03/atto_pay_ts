"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const supertest_1 = tslib_1.__importDefault(require("supertest"));
const app_1 = require("@/app");
const _database_1 = tslib_1.__importDefault(require("@database"));
const customers_route_1 = require("@routes/customers.route");
afterAll(async () => {
    await new Promise(resolve => setTimeout(() => resolve(), 500));
    await _database_1.default.end();
});
describe('Testing Auth', () => {
    describe('[POST] /register', () => {
        const customerRoute = new customers_route_1.CustomersRoute();
        const app = new app_1.App([customerRoute]);
        const userData = {
            name: 'name',
            phone: '998949315433',
            password: 'password12',
        };
        it('response should have the Create userData', async () => {
            const response = await (0, supertest_1.default)(app.getServer()).post('/customer/register').send(userData);
            expect(response.statusCode).toBe(201);
        });
        it('validation error', async () => {
            userData.password = '';
            const response = await (0, supertest_1.default)(app.getServer()).post('/customer/register').send(userData);
            expect(response.statusCode).toBe(400);
        });
    });
    describe('[POST] /login', () => {
        it('response should have the Set-Cookie header with the Authorization token', async () => {
            const userData = {
                name: 'name',
                phone: '998949315431',
                password: 'password12',
            };
            const customerRoute = new customers_route_1.CustomersRoute();
            const app = new app_1.App([customerRoute]);
            const response = await (0, supertest_1.default)(app.getServer()).post('/customer/login').send(userData);
            expect(response.statusCode).toBe(200);
        });
    });
});
//# sourceMappingURL=auth.test.js.map