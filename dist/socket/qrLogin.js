"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.qrLoginRequest = void 0;
const tslib_1 = require("tslib");
const crypto_1 = tslib_1.__importDefault(require("crypto"));
const base64url_1 = tslib_1.__importDefault(require("base64url"));
const moment_1 = tslib_1.__importDefault(require("moment"));
const redis_1 = require("../database/redis");
const livr_1 = require("livr");
const CustomError_1 = require("@exceptions/CustomError");
async function qrLoginRequest(socket) {
    const redis = new redis_1.RedisClient();
    const deviceId = socket.handshake.headers.deviceid;
    const validator = new livr_1.Validator({
        deviceId: ['required', 'string'],
    });
    const validData = validator.validate({ deviceId });
    if (!validData)
        throw new CustomError_1.CustomError(validator.getErrors());
    const key = (0, base64url_1.default)(crypto_1.default.randomBytes(32));
    const body = {
        key,
        expiresAt: (0, moment_1.default)().add(2, 'minutes').toISOString(),
        socketId: socket.id,
    };
    await redis.hSet('qr_login', deviceId, JSON.stringify(body));
    socket.emit('qr_login_response', { key, deviceId });
}
exports.qrLoginRequest = qrLoginRequest;
//# sourceMappingURL=qrLogin.js.map