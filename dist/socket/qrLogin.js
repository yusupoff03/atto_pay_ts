"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "qrLoginRequest", {
    enumerable: true,
    get: function() {
        return qrLoginRequest;
    }
});
const _crypto = /*#__PURE__*/ _interop_require_default(require("crypto"));
const _base64url = /*#__PURE__*/ _interop_require_default(require("base64url"));
const _moment = /*#__PURE__*/ _interop_require_default(require("moment"));
const _redis = require("../database/redis");
const _livr = require("livr");
const _CustomError = require("../exceptions/CustomError");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
async function qrLoginRequest(socket) {
    const redis = new _redis.RedisClient();
    const deviceId = socket.handshake.headers.deviceid;
    const validator = new _livr.Validator({
        deviceId: [
            'required',
            'string'
        ]
    });
    const validData = validator.validate({
        deviceId
    });
    if (!validData) throw new _CustomError.CustomError(validator.getErrors());
    const key = (0, _base64url.default)(_crypto.default.randomBytes(32));
    const body = {
        key,
        expiresAt: (0, _moment.default)().add(2, 'minutes').toISOString(),
        socketId: socket.id
    };
    await redis.hSet('qr_login', deviceId, JSON.stringify(body));
    socket.emit('qr_login_response', {
        key,
        deviceId
    });
}

//# sourceMappingURL=qrLogin.js.map