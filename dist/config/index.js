"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    CREDENTIALS: function() {
        return CREDENTIALS;
    },
    NODE_ENV: function() {
        return NODE_ENV;
    },
    PORT: function() {
        return PORT;
    },
    SECRET_KEY: function() {
        return SECRET_KEY;
    },
    LOG_FORMAT: function() {
        return LOG_FORMAT;
    },
    LOG_DIR: function() {
        return LOG_DIR;
    },
    ORIGIN: function() {
        return ORIGIN;
    },
    POSTGRES_USER: function() {
        return POSTGRES_USER;
    },
    POSTGRES_URL: function() {
        return POSTGRES_URL;
    },
    POSTGRES_PASSWORD: function() {
        return POSTGRES_PASSWORD;
    },
    POSTGRES_HOST: function() {
        return POSTGRES_HOST;
    },
    POSTGRES_PORT: function() {
        return POSTGRES_PORT;
    },
    POSTGRES_DB: function() {
        return POSTGRES_DB;
    },
    POSTGRES_SSL: function() {
        return POSTGRES_SSL;
    },
    REDIS_TLS: function() {
        return REDIS_TLS;
    }
});
const _dotenv = require("dotenv");
(0, _dotenv.config)({
    path: `.env.${process.env.NODE_ENV || 'development'}.local`
});
const CREDENTIALS = process.env.CREDENTIALS === 'true';
const { NODE_ENV, PORT, SECRET_KEY, LOG_FORMAT, LOG_DIR, ORIGIN } = process.env;
const { POSTGRES_USER, POSTGRES_URL, POSTGRES_PASSWORD, POSTGRES_HOST, POSTGRES_PORT, POSTGRES_DB, POSTGRES_SSL } = process.env;
const { REDIS_TLS } = process.env;

//# sourceMappingURL=index.js.map