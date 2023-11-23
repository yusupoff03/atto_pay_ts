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
    ErrorMiddleware: function() {
        return ErrorMiddleware;
    },
    errorHandler: function() {
        return errorHandler;
    }
});
const _logger = require("../utils/logger");
const _database = /*#__PURE__*/ _interop_require_default(require("../database"));
function _define_property(obj, key, value) {
    if (key in obj) {
        Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true
        });
    } else {
        obj[key] = value;
    }
    return obj;
}
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function _object_spread(target) {
    for(var i = 1; i < arguments.length; i++){
        var source = arguments[i] != null ? arguments[i] : {};
        var ownKeys = Object.keys(source);
        if (typeof Object.getOwnPropertySymbols === "function") {
            ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function(sym) {
                return Object.getOwnPropertyDescriptor(source, sym).enumerable;
            }));
        }
        ownKeys.forEach(function(key) {
            _define_property(target, key, source[key]);
        });
    }
    return target;
}
function ownKeys(object, enumerableOnly) {
    var keys = Object.keys(object);
    if (Object.getOwnPropertySymbols) {
        var symbols = Object.getOwnPropertySymbols(object);
        if (enumerableOnly) {
            symbols = symbols.filter(function(sym) {
                return Object.getOwnPropertyDescriptor(object, sym).enumerable;
            });
        }
        keys.push.apply(keys, symbols);
    }
    return keys;
}
function _object_spread_props(target, source) {
    source = source != null ? source : {};
    if (Object.getOwnPropertyDescriptors) {
        Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
        ownKeys(Object(source)).forEach(function(key) {
            Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
        });
    }
    return target;
}
const ErrorMiddleware = async (error, req, res, next)=>{
    console.log(error);
    try {
        const lang = req.acceptsLanguages('en', 'ru', 'uz') || 'en';
        const result = await defaultErrorHandler(error, lang);
        _logger.logger.error(`[${req.method}] ${req.path} >> StatusCode:: ${result.status}, Message:: ${result.message}`);
        res.status(result.status).json({
            message: result.message,
            status: result.status,
            info: result.info,
            type: result.type,
            details: result.details,
            stack: result.stack
        });
    } catch (err) {
        next(err);
    }
};
async function defaultErrorHandler(error, lang) {
    var _errorObject_, _errorObject_1;
    const isDevenv = process.env.NODE_ENV === 'development';
    const { rows: errorObject } = await _database.default.query(`SELECT message -> $2 AS message, http_code
       FROM message
       WHERE name = $1`, [
        error.name,
        lang
    ]);
    const status = ((_errorObject_ = errorObject[0]) === null || _errorObject_ === void 0 ? void 0 : _errorObject_.http_code) || 500;
    let message = ((_errorObject_1 = errorObject[0]) === null || _errorObject_1 === void 0 ? void 0 : _errorObject_1.message) || 'Something went wrong';
    let info = error.info;
    const type = error.name;
    const details = isDevenv ? error.message : undefined;
    const stack = isDevenv ? error.stack : undefined;
    switch(error.name){
        case 'USER_BLOCKED':
            {
                if (errorObject) {
                    var _error_info;
                    info = _object_spread_props(_object_spread({}, info), {
                        message: errorObject[0].message,
                        timeLeft: error.info
                    });
                    message = errorObject[0].message.replace('{0}', ((_error_info = error.info) === null || _error_info === void 0 ? void 0 : _error_info.toString()) || '60');
                }
                break;
            }
        case 'VALIDATION_ERROR':
            {
                var _error_info1;
                info = _object_spread_props(_object_spread({}, info), {
                    message: errorObject[0].message
                });
                message = errorObject[0].message.replace(`{0}`, (_error_info1 = error.info) === null || _error_info1 === void 0 ? void 0 : _error_info1.toString());
                break;
            }
    }
    return {
        status,
        type,
        details,
        stack,
        info,
        message
    };
}
const errorHandler = (socket, handler)=>{
    const handleError = async (err)=>{
        const lang = socket.handshake.headers.lang || 'en';
        const body = await defaultErrorHandler(err, lang);
        if (body) {
            socket.emit(body);
        }
    };
    return (...args)=>{
        try {
            const ret = handler.apply(void 0, [
                socket,
                ...args
            ]);
            if (ret && typeof ret.catch === 'function') {
                ret.catch(handleError);
            }
        } catch (error) {
            handleError(error);
        }
    };
};

//# sourceMappingURL=error.middleware.js.map