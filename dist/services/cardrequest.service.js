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
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
let CardRequestService = class CardRequestService {
    static async cardNewOtp(pan, expiry) {
        const params = {
            card: {
                pan: `${pan}`,
                expiry: `${expiry}`
            }
        };
        return await this.cardRequest(params, 'cards.new.otp');
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