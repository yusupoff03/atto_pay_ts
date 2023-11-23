"use strict";
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SMS_SERVICE_SECRET = exports.CRM_API_URL = exports.REDIS_TLS = exports.POSTGRES_SSL = exports.POSTGRES_DB = exports.POSTGRES_PORT = exports.POSTGRES_HOST = exports.POSTGRES_PASSWORD = exports.POSTGRES_URL = exports.POSTGRES_USER = exports.ORIGIN = exports.LOG_DIR = exports.LOG_FORMAT = exports.SECRET_KEY = exports.PORT = exports.NODE_ENV = exports.CREDENTIALS = void 0;
const tslib_1 = require("tslib");
const dotenv_1 = require("dotenv");
const process = tslib_1.__importStar(require("process"));
(0, dotenv_1.config)({ path: `.env.${process.env.NODE_ENV || 'development'}.local` });
exports.CREDENTIALS = process.env.CREDENTIALS === 'true';
_a = process.env, exports.NODE_ENV = _a.NODE_ENV, exports.PORT = _a.PORT, exports.SECRET_KEY = _a.SECRET_KEY, exports.LOG_FORMAT = _a.LOG_FORMAT, exports.LOG_DIR = _a.LOG_DIR, exports.ORIGIN = _a.ORIGIN;
_b = process.env, exports.POSTGRES_USER = _b.POSTGRES_USER, exports.POSTGRES_URL = _b.POSTGRES_URL, exports.POSTGRES_PASSWORD = _b.POSTGRES_PASSWORD, exports.POSTGRES_HOST = _b.POSTGRES_HOST, exports.POSTGRES_PORT = _b.POSTGRES_PORT, exports.POSTGRES_DB = _b.POSTGRES_DB, exports.POSTGRES_SSL = _b.POSTGRES_SSL;
exports.REDIS_TLS = process.env.REDIS_TLS;
_c = process.env, exports.CRM_API_URL = _c.CRM_API_URL, exports.SMS_SERVICE_SECRET = _c.SMS_SERVICE_SECRET;
//# sourceMappingURL=index.js.map