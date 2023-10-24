"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "AuthMiddleware", {
    enumerable: true,
    get: function() {
        return AuthMiddleware;
    }
});
const _jsonwebtoken = require("jsonwebtoken");
const _config = require("../config");
const _CustomError = require("../exceptions/CustomError");
const getAuthorization = (req)=>{
    const cookie = req.headers.authorization;
    if (cookie) return cookie;
    return null;
};
const AuthMiddleware = async (req, res, next)=>{
    try {
        const Authorization = getAuthorization(req);
        if (Authorization) {
            const { id } = await (0, _jsonwebtoken.verify)(Authorization, _config.SECRET_KEY);
            if (id) {
                next();
            } else {
                next(new _CustomError.CustomError('MISSING_TOKEN'));
            }
        } else {
            next(new _CustomError.CustomError('MISSING_TOKEN'));
        }
    } catch (error) {
        next(new _CustomError.CustomError('MISSING_TOKEN'));
    }
};

//# sourceMappingURL=auth.middleware.js.map