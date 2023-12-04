"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "CardRequestService", {
    enumerable: true,
    get: function() {
        return CardRequestService;
    }
});
const _config = require("../config");
const _axios = /*#__PURE__*/ _interop_require_default(require("axios"));
const _CustomError = require("../exceptions/CustomError");
const _crypto = /*#__PURE__*/ _interop_require_default(require("crypto"));
const _base64url = /*#__PURE__*/ _interop_require_default(require("base64url"));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
let CardRequestService = class CardRequestService {
    static async cardNewOtp(pan, expiry, phone) {
        const params = {
            card: {
                pan: `${pan}`,
                expiry: `${expiry}`,
                requestorPhone: `${phone}`
            }
        };
        const response = await this.cardRequest(params, 'cards.new.otp');
        const error = response.data.error;
        if (error) {
            switch(error.code){
                case -200:
                    throw new _CustomError.CustomError('CARD_NOT_FOUND');
                    break;
                case -261:
                    throw new _CustomError.CustomError('CARD_BLOCKED');
                    break;
                case -270:
                case -314:
                case -317:
                    throw new _CustomError.CustomError('EXPIRED_OTP');
                    break;
                case -269:
                    throw new _CustomError.CustomError('WRONG_OTP');
                    break;
                case -320:
                    throw new _CustomError.CustomError('CARD_BELONGS_TO_ANOTHER');
                    break;
                default:
                    throw new _CustomError.CustomError('SVGATE_ERROR');
                    break;
            }
        }
        return response;
    }
    static async CardVerify(id, code) {
        const params = {
            otp: {
                id: id,
                code: code
            }
        };
        return await this.cardRequest(params, 'cards.new.verify');
    }
    static async cardPayment(cardToken, amount) {
        const params = {
            tran: {
                purpose: 'payment',
                cardId: cardToken,
                amount: amount * 100,
                ext: `SVGATE_${(0, _base64url.default)(_crypto.default.randomBytes(32))}`,
                merchantId: '90126913',
                terminalId: '91500009'
            }
        };
        const response = await this.cardRequest(params, 'trans.pay.purpose');
        const error = response.data.error;
        if (error) {
            switch(error.code){
                case -200:
                    throw new _CustomError.CustomError('CARD_NOT_FOUND');
                    break;
                case -261:
                    throw new _CustomError.CustomError('CARD_BLOCKED');
                    break;
                case -270:
                case -314:
                case -317:
                    throw new _CustomError.CustomError('EXPIRED_OTP');
                    break;
                case -269:
                    throw new _CustomError.CustomError('WRONG_OTP');
                    break;
                case -320:
                    throw new _CustomError.CustomError('CARD_BELONGS_TO_ANOTHER');
                    break;
                default:
                    throw new _CustomError.CustomError('SVGATE_ERROR');
                    break;
            }
        }
        return response;
    }
    static async cardRequest(params, method) {
        const url = `${_config.CARD_SERVICE_URL}`;
        const username = `${_config.CARD_SERVICE_USERNAME}`;
        const password = `${_config.CARD_SERVICE_PASSWORD}`;
        const options = {
            method: 'POST',
            url: url,
            auth: {
                username,
                password
            },
            data: {
                jsonrpc: '2.0',
                method: method,
                id: 'afff34abc',
                params
            }
        };
        return (0, _axios.default)(options);
    }
};

//# sourceMappingURL=cardrequest.service.js.map