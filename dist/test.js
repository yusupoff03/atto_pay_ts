"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "request", {
    enumerable: true,
    get: function() {
        return request;
    }
});
const _axios = /*#__PURE__*/ _interop_require_default(require("axios"));
const _CustomError = require("./exceptions/CustomError");
const _config = require("./config");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
async function request(cardNumber) {
    const url = `${_config.CRM_API_URL}/terminal/top-up/check?cardNumber=${cardNumber}`;
    const options = {
        method: 'GET',
        url: url,
        headers: {
            'Content-Type': 'application/json',
            access_token: 'wddcvzlfsjakndi6y0obqg8xd06iau'
        },
        data: {
            login: 'faresaler',
            password: '1234567$fF'
        }
    };
    try {
        return await (0, _axios.default)(options);
    } catch (error) {
        throw new _CustomError.CustomError('CARD_NOT_FOUND');
    }
}

//# sourceMappingURL=test.js.map