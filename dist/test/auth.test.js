"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _supertest = /*#__PURE__*/ _interop_require_default(require("supertest"));
const _app = require("../app");
const _database = /*#__PURE__*/ _interop_require_default(require("../database"));
const _customersroute = require("@routes/customers.route");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
afterAll(async ()=>{
    await new Promise((resolve)=>setTimeout(()=>resolve(), 500));
    await _database.default.end();
});
describe('Testing Auth', ()=>{
    describe('[POST] /register', ()=>{
        const customerRoute = new _customersroute.CustomersRoute();
        const app = new _app.App([
            customerRoute
        ]);
        const userData = {
            name: 'name',
            phone: '998949315433',
            password: 'password12'
        };
        it('response should have the Create userData', async ()=>{
            const response = await (0, _supertest.default)(app.getServer()).post('/customer/register').send(userData);
            expect(response.statusCode).toBe(201);
        });
        it('validation error', async ()=>{
            userData.password = '';
            const response = await (0, _supertest.default)(app.getServer()).post('/customer/register').send(userData);
            expect(response.statusCode).toBe(400);
        });
    });
    describe('[POST] /login', ()=>{
        it('response should have the Set-Cookie header with the Authorization token', async ()=>{
            const userData = {
                name: 'name',
                phone: '998949315431',
                password: 'password12'
            };
            const customerRoute = new _customersroute.CustomersRoute();
            const app = new _app.App([
                customerRoute
            ]);
            const response = await (0, _supertest.default)(app.getServer()).post('/customer/login').send(userData);
            expect(response.statusCode).toBe(200);
        });
    });
});

//# sourceMappingURL=auth.test.js.map