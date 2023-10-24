"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "MerchantService", {
    enumerable: true,
    get: function() {
        return MerchantService;
    }
});
const _bcrypt = require("bcrypt");
const _typedi = require("typedi");
const _database = /*#__PURE__*/ _interop_require_default(require("../database"));
const _httpException = require("../exceptions/httpException");
const _CustomError = require("../exceptions/CustomError");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let MerchantService = class MerchantService {
    async getMerchantById(merchantId) {
        const { rows, rowCount } = await _database.default.query(`Select * from merchant where id=$1`, [
            merchantId
        ]);
        if (!rowCount) {
            throw new _CustomError.CustomError('USER_NOT_FOUND');
        }
        return rows[0];
    }
    async updateMerchant(merchantId, name, password) {
        const { rows: findMerchant } = await _database.default.query(`
                 SELECT *
                 FROM merchant
                 WHERE "id" = $1
                 )`, [
            merchantId
        ]);
        if (findMerchant[0].exists) throw new _httpException.HttpException(409, "Merchant doesn't exist");
        const hashedPassword = await (0, _bcrypt.hash)(password, 10);
        const newName = name || findMerchant[0].name;
        const newHashedPassword = hashedPassword || findMerchant[0].hashed_password;
        const { rows: updateMerchantData } = await _database.default.query(`
        UPDATE
          merchant
        SET "email"    = $2,
            "hashed_password" = $3
        WHERE "id" = $1 RETURNING "phone", "hashed_password"
      `, [
            merchantId,
            newName,
            newHashedPassword
        ]);
        return updateMerchantData[0];
    }
    async updateMerchantLang(merchantId, lang) {
        const { rows } = await _database.default.query(`Select * from merchant where id=$1`, [
            merchantId
        ]);
        if (!rows[0]) {
            throw new _CustomError.CustomError('USER_NOT_FOUND');
        }
        await _database.default.query(`Update merchant set lang = $1  where id = $2`, [
            lang,
            merchantId
        ]);
    }
    async deleteMerchant(merchantId) {
        const { rows, rowCount } = await _database.default.query(`Select * from merchant where id=$1`, [
            merchantId
        ]);
        if (!rowCount) {
            throw new _httpException.HttpException(404, 'Merchant not found');
        }
        await _database.default.query(`delete from merchant where id=$1`, [
            merchantId
        ]);
    }
};
MerchantService = _ts_decorate([
    (0, _typedi.Service)()
], MerchantService);

//# sourceMappingURL=merchant.service.js.map