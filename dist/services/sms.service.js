"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendVerification = void 0;
const tslib_1 = require("tslib");
const CustomError_1 = require("@exceptions/CustomError");
const axios_1 = tslib_1.__importDefault(require("axios"));
const _config_1 = require("@config");
async function sendSMS(phone, msg) {
    const url = `${_config_1.CRM_API_URL}/customer/send-sms`;
    const options = {
        method: 'POST',
        url: url,
        headers: {
            secret: _config_1.SMS_SERVICE_SECRET,
        },
        data: {
            phone,
            msg,
        },
    };
    return await (0, axios_1.default)(options);
}
async function sendVerification(phone, code) {
    try {
        const msg = `AttoPay: this is your verification code: ${code}`;
        const response = await sendSMS(phone, msg);
        return response;
    }
    catch (error) {
        throw new CustomError_1.CustomError(error.message);
    }
}
exports.sendVerification = sendVerification;
//# sourceMappingURL=sms.service.js.map