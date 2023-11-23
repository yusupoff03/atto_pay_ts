"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.request = void 0;
const tslib_1 = require("tslib");
const axios_1 = tslib_1.__importDefault(require("axios"));
const CustomError_1 = require("@exceptions/CustomError");
const _config_1 = require("@config");
async function request(cardNumber) {
    const url = `${_config_1.CRM_API_URL}/terminal/top-up/check?cardNumber=${cardNumber}`;
    const options = {
        method: 'GET',
        url: url,
        headers: {
            'Content-Type': 'application/json',
            access_token: 'wddcvzlfsjakndi6y0obqg8xd06iau',
        },
        data: {
            login: 'faresaler',
            password: '1234567$fF',
        },
    };
    try {
        return await (0, axios_1.default)(options);
    }
    catch (error) {
        throw new CustomError_1.CustomError('CARD_NOT_FOUND');
    }
}
exports.request = request;
//# sourceMappingURL=test.js.map