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
    },
    CRM_API_URL: function() {
        return CRM_API_URL;
    },
    SMS_SERVICE_SECRET: function() {
        return SMS_SERVICE_SECRET;
    },
    CARD_SERVICE_URL: function() {
        return CARD_SERVICE_URL;
    },
    CARD_SERVICE_USERNAME: function() {
        return CARD_SERVICE_USERNAME;
    },
    CARD_SERVICE_PASSWORD: function() {
        return CARD_SERVICE_PASSWORD;
    }
});
const _dotenv = require("dotenv");
const _process = /*#__PURE__*/ _interop_require_wildcard(require("process"));
function _getRequireWildcardCache(nodeInterop) {
    if (typeof WeakMap !== "function") return null;
    var cacheBabelInterop = new WeakMap();
    var cacheNodeInterop = new WeakMap();
    return (_getRequireWildcardCache = function(nodeInterop) {
        return nodeInterop ? cacheNodeInterop : cacheBabelInterop;
    })(nodeInterop);
}
function _interop_require_wildcard(obj, nodeInterop) {
    if (!nodeInterop && obj && obj.__esModule) {
        return obj;
    }
    if (obj === null || typeof obj !== "object" && typeof obj !== "function") {
        return {
            default: obj
        };
    }
    var cache = _getRequireWildcardCache(nodeInterop);
    if (cache && cache.has(obj)) {
        return cache.get(obj);
    }
    var newObj = {};
    var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;
    for(var key in obj){
        if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) {
            var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;
            if (desc && (desc.get || desc.set)) {
                Object.defineProperty(newObj, key, desc);
            } else {
                newObj[key] = obj[key];
            }
        }
    }
    newObj.default = obj;
    if (cache) {
        cache.set(obj, newObj);
    }
    return newObj;
}
(0, _dotenv.config)({
    path: `.env.${_process.env.NODE_ENV || 'development'}.local`
});
const CREDENTIALS = _process.env.CREDENTIALS === 'true';
const { NODE_ENV, PORT, SECRET_KEY, LOG_FORMAT, LOG_DIR, ORIGIN } = _process.env;
const { POSTGRES_USER, POSTGRES_URL, POSTGRES_PASSWORD, POSTGRES_HOST, POSTGRES_PORT, POSTGRES_DB, POSTGRES_SSL } = _process.env;
const { REDIS_TLS } = _process.env;
const { CRM_API_URL, SMS_SERVICE_SECRET, CARD_SERVICE_URL } = _process.env;
const { CARD_SERVICE_USERNAME, CARD_SERVICE_PASSWORD } = _process.env;

//# sourceMappingURL=index.js.map