"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = exports.ErrorMiddleware = void 0;
const tslib_1 = require("tslib");
const logger_1 = require("@utils/logger");
const _database_1 = tslib_1.__importDefault(require("@database"));
const ErrorMiddleware = async (error, req, res, next) => {
    console.log(error);
    try {
        const lang = req.acceptsLanguages('en', 'ru', 'uz') || 'en';
        const result = await defaultErrorHandler(error, lang);
        logger_1.logger.error(`[${req.method}] ${req.path} >> StatusCode:: ${result.status}, Message:: ${result.message}`);
        res
            .status(result.status)
            .json({ message: result.message, status: result.status, info: result.info, type: result.type, details: result.details, stack: result.stack });
    }
    catch (err) {
        next(err);
    }
};
exports.ErrorMiddleware = ErrorMiddleware;
async function defaultErrorHandler(error, lang) {
    var _a, _b, _c, _d;
    const isDevenv = process.env.NODE_ENV === 'development';
    const { rows: errorObject } = await _database_1.default.query(`SELECT message -> $2 AS message, http_code
       FROM message
       WHERE name = $1`, [error.name, lang]);
    const status = ((_a = errorObject[0]) === null || _a === void 0 ? void 0 : _a.http_code) || 500;
    let message = ((_b = errorObject[0]) === null || _b === void 0 ? void 0 : _b.message) || 'Something went wrong';
    let info = error.info;
    const type = error.name;
    const details = isDevenv ? error.message : undefined;
    const stack = isDevenv ? error.stack : undefined;
    switch (error.name) {
        case 'USER_BLOCKED': {
            if (errorObject) {
                info = Object.assign(Object.assign({}, info), { message: errorObject[0].message, timeLeft: error.info });
                message = errorObject[0].message.replace('{0}', ((_c = error.info) === null || _c === void 0 ? void 0 : _c.toString()) || '60');
            }
            break;
        }
        case 'VALIDATION_ERROR': {
            info = Object.assign(Object.assign({}, info), { message: errorObject[0].message });
            message = errorObject[0].message.replace(`{0}`, (_d = error.info) === null || _d === void 0 ? void 0 : _d.toString());
            break;
        }
    }
    return { status, type, details, stack, info, message };
}
const errorHandler = (socket, handler) => {
    const handleError = async (err) => {
        const lang = socket.handshake.headers.lang || 'en';
        const body = await defaultErrorHandler(err, lang);
        if (body) {
            socket.emit(body);
        }
    };
    return (...args) => {
        try {
            const ret = handler.apply(this, [socket, ...args]);
            if (ret && typeof ret.catch === 'function') {
                ret.catch(handleError);
            }
        }
        catch (error) {
            handleError(error);
        }
    };
};
exports.errorHandler = errorHandler;
//# sourceMappingURL=error.middleware.js.map