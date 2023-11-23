"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "sendVerification", {
    enumerable: true,
    get: function() {
        return sendVerification;
    }
});
const _CustomError = require("../exceptions/CustomError");
const _axios = /*#__PURE__*/ _interop_require_default(require("axios"));
const _config = require("../config");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
async function sendSMS(phone, msg) {
    const url = `${_config.CRM_API_URL}/customer/send-sms`;
    const options = {
        method: 'POST',
        url: url,
        headers: {
            secret: _config.SMS_SERVICE_SECRET
        },
        data: {
            phone,
            msg
        }
    };
    return await (0, _axios.default)(options);
}
async function sendVerification(phone, code) {
    try {
        const msg = `AttoPay: this is your verification code: ${code}`;
        const response = await sendSMS(phone, msg);
        return response;
    } catch (error) {
        throw new _CustomError.CustomError(error.message);
    }
}

//# sourceMappingURL=sms.service.js.map