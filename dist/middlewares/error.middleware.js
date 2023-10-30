"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorMiddleware = void 0;
const tslib_1 = require("tslib");
const logger_1 = require("../utils/logger");
const _database_1 = tslib_1.__importDefault(require("../database"));
const ErrorMiddleware = async (error, req, res, next) => {
    var _a, _b, _c;
    const isDevenv = process.env.NODE_ENV === 'development';
    console.log(error);
    try {
        const lang = req.acceptsLanguages('en', 'ru', 'uz') || 'en';
        const { rows: errorObject } = await _database_1.default.query(`SELECT message -> $2 AS message, http_code
       FROM message
       WHERE name = $1`, [error.name.toUpperCase(), lang]);
        const status = ((_a = errorObject[0]) === null || _a === void 0 ? void 0 : _a.http_code) || 500;
        let message = ((_b = errorObject[0]) === null || _b === void 0 ? void 0 : _b.message) || 'Something went wrong';
        let info = error.info;
        const type = error.name;
        const details = isDevenv ? error.message : undefined;
        const stack = isDevenv ? error.stack : undefined;
        switch (error.name) {
            case 'USER_BLOCKED': {
                if (errorObject) {
                    info = Object.assign(Object.assign({}, info), { message: errorObject[0].message });
                    message = errorObject[0].message.replace('{0}', ((_c = error.info) === null || _c === void 0 ? void 0 : _c.toString()) || '60');
                }
            }
        }
        logger_1.logger.error(`[${req.method}] ${req.path} >> StatusCode:: ${status}, Message:: ${message}`);
        res.status(status).json({ message, status, info, type, details, stack });
    }
    catch (err) {
        next(err);
    }
};
exports.ErrorMiddleware = ErrorMiddleware;
//# sourceMappingURL=error.middleware.js.map