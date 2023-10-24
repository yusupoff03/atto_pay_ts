"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthMiddleware = void 0;
const jsonwebtoken_1 = require("jsonwebtoken");
const _config_1 = require("../config");
const CustomError_1 = require("../exceptions/CustomError");
const getAuthorization = req => {
    const cookie = req.headers.authorization;
    if (cookie)
        return cookie;
    return null;
};
const AuthMiddleware = async (req, res, next) => {
    try {
        const Authorization = getAuthorization(req);
        if (Authorization) {
            const { id } = (await (0, jsonwebtoken_1.verify)(Authorization, _config_1.SECRET_KEY));
            if (id) {
                next();
            }
            else {
                next(new CustomError_1.CustomError('MISSING_TOKEN'));
            }
        }
        else {
            next(new CustomError_1.CustomError('MISSING_TOKEN'));
        }
    }
    catch (error) {
        next(new CustomError_1.CustomError('MISSING_TOKEN'));
    }
};
exports.AuthMiddleware = AuthMiddleware;
//# sourceMappingURL=auth.middleware.js.map