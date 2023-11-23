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
const _typedi = require("typedi");
const _database = /*#__PURE__*/ _interop_require_default(require("../database"));
const _httpException = require("../exceptions/httpException");
const _CustomError = require("../exceptions/CustomError");
const _redis = /*#__PURE__*/ _interop_require_default(require("../database/redis"));
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
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
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
    async updateMerchant(merchantId, name) {
        const { rows: findMerchant } = await _database.default.query(`
                 SELECT *
                 FROM merchant
                 WHERE id = $1
                 `, [
            merchantId
        ]);
        if (findMerchant[0].exists) throw new _CustomError.CustomError('USER_NOT_FOUND');
        const newName = name || findMerchant[0].name;
        const { rows: updateMerchantData } = await _database.default.query(`
        UPDATE
          merchant
        SET name = $2
        WHERE id = $1
      `, [
            merchantId,
            newName
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
    constructor(){
        _define_property(this, "redis", void 0);
        this.redis = new _redis.default();
    }
};
MerchantService = _ts_decorate([
    (0, _typedi.Service)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [])
], MerchantService);

//# sourceMappingURL=merchant.service.js.map