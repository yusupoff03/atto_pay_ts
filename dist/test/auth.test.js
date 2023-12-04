"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "token", {
    enumerable: true,
    get: function() {
        return token;
    }
});
const _supertest = /*#__PURE__*/ _interop_require_default(require("supertest"));
const _app = require("../app");
const _database = /*#__PURE__*/ _interop_require_default(require("../database"));
const _customersroute = require("@routes/customers.route");
const _merchantroute = require("@routes/merchant.route");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
afterAll(async ()=>{
    await new Promise((resolve)=>setTimeout(()=>resolve(), 500));
    await _database.default.end();
});
let token = '';
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
    describe('[POST] /get-login-type', ()=>{
        it('password or otp', async ()=>{
            const customerRoute = new _customersroute.CustomersRoute();
            const app = new _app.App([
                customerRoute
            ]);
            const phone = '998111111111';
            const response = await (0, _supertest.default)(app.getServer().set('x-device-id', 'zeydc-vostro')).post('/customer/getlogin').send({
                phone
            });
            expect(response.statusCode).toBe(200);
        });
    });
    describe('[POST] /get-login-type', ()=>{
        it('password or otp error test', async ()=>{
            const customerRoute = new _customersroute.CustomersRoute();
            const app = new _app.App([
                customerRoute
            ]);
            const phone = '998111111';
            const response = await (0, _supertest.default)(app.getServer().set('x-device-id', 'zeydc-vostro')).post('/customer/getlogin').send({
                phone
            });
            expect(response.statusCode).toBe(400);
        });
    });
    describe('[POST] /send verification code', ()=>{
        it('verification', async ()=>{
            const merchantRoute = new _merchantroute.MerchantRoute();
            const app = new _app.App([
                merchantRoute
            ]);
            const email = 'yusupovulugbek73@gmail.com';
            const response = await (0, _supertest.default)(app.getServer().set('x-device-id', 'zeydc-vostro')).post('/merchant/sendcode').send({
                email
            });
            expect(response.statusCode).toBe(200);
        });
    });
    describe('[POST] /sign-up merchant', ()=>{
        it('merchant register', async ()=>{
            const merchantRoute = new _merchantroute.MerchantRoute();
            const app = new _app.App([
                merchantRoute
            ]);
            const merchant = {
                name: 'merchant',
                email: 'yusupovulugbek73@gmail.com',
                password: 'aaa1111'
            };
            const otp = '218822';
            const requestBody = {
                name: merchant.name,
                email: merchant.email,
                password: merchant.password,
                otp: otp
            };
            const response = await (0, _supertest.default)(app.getServer().set('x-device-id', 'zeydc-vostro')).post('/merchant/register').send(requestBody);
            expect(response.statusCode).toBe(201);
        });
    });
    describe('[POST] /login merchant', ()=>{
        it('login merchant', async ()=>{
            const merchantRoute = new _merchantroute.MerchantRoute();
            const app = new _app.App([
                merchantRoute
            ]);
            const response = await (0, _supertest.default)(app.getServer().set('x-device-id', 'zeydc-vostro')).post('/merchant/login').send({
                email: 'yusupovulugbek73@gmail.com',
                password: 'aaa1111'
            });
            expect(response.statusCode).toBe(200);
            console.log(response.body.token);
        });
    });
    describe('[POST] /sign-up merchant', ()=>{
        it('merchant register', async ()=>{
            const merchantRoute = new _merchantroute.MerchantRoute();
            const app = new _app.App([
                merchantRoute
            ]);
            const merchant = {
                name: 'merchant',
                email: 'yusupovulugbek73',
                password: 'aaa1111'
            };
            const otp = '557294';
            const requestBody = {
                email: merchant.email,
                name: merchant.name,
                password: merchant.password,
                otp: otp
            };
            const response = await (0, _supertest.default)(app.getServer().set('x-device-id', 'zeydc-vostro')).post('/merchant/register').send(requestBody);
            expect(response.statusCode).toBe(400);
        });
    });
    describe('[POST] /sign-up merchant', ()=>{
        it('merchant register', async ()=>{
            const merchantRoute = new _merchantroute.MerchantRoute();
            const app = new _app.App([
                merchantRoute
            ]);
            const merchant = {
                name: 'merchant',
                email: 'yusupovulugbek73@gmail.com',
                password: 'aaa11'
            };
            const otp = '557294';
            const requestBody = {
                email: merchant.email,
                name: merchant.name,
                password: merchant.password,
                otp: otp
            };
            const response = await (0, _supertest.default)(app.getServer().set('x-device-id', 'zeydc-vostro')).post('/merchant/register').send(requestBody);
            expect(response.statusCode).toBe(400);
        });
    });
});

//# sourceMappingURL=auth.test.js.map