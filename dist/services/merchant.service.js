"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MerchantService = void 0;
const tslib_1 = require("tslib");
const typedi_1 = require("typedi");
const _database_1 = tslib_1.__importDefault(require("@database"));
const httpException_1 = require("@exceptions/httpException");
const CustomError_1 = require("@exceptions/CustomError");
const redis_1 = tslib_1.__importDefault(require("@/database/redis"));
let MerchantService = class MerchantService {
    constructor() {
        this.redis = new redis_1.default();
    }
    async getMerchantById(merchantId) {
        const { rows, rowCount } = await _database_1.default.query(`Select * from merchant where id=$1`, [merchantId]);
        if (!rowCount) {
            throw new CustomError_1.CustomError('USER_NOT_FOUND');
        }
        return rows[0];
    }
    async updateMerchant(merchantId, name) {
        const { rows: findMerchant } = await _database_1.default.query(`
                 SELECT *
                 FROM merchant
                 WHERE id = $1
                 `, [merchantId]);
        if (findMerchant[0].exists)
            throw new CustomError_1.CustomError('USER_NOT_FOUND');
        const newName = name || findMerchant[0].name;
        const { rows: updateMerchantData } = await _database_1.default.query(`
        UPDATE
          merchant
        SET name = $2
        WHERE id = $1
      `, [merchantId, newName]);
        return updateMerchantData[0];
    }
    async updateMerchantLang(merchantId, lang) {
        const { rows } = await _database_1.default.query(`Select * from merchant where id=$1`, [merchantId]);
        if (!rows[0]) {
            throw new CustomError_1.CustomError('USER_NOT_FOUND');
        }
        await _database_1.default.query(`Update merchant set lang = $1  where id = $2`, [lang, merchantId]);
    }
    async deleteMerchant(merchantId) {
        const { rows, rowCount } = await _database_1.default.query(`Select * from merchant where id=$1`, [merchantId]);
        if (!rowCount) {
            throw new httpException_1.HttpException(404, 'Merchant not found');
        }
        await _database_1.default.query(`delete from merchant where id=$1`, [merchantId]);
    }
};
MerchantService = tslib_1.__decorate([
    (0, typedi_1.Service)(),
    tslib_1.__metadata("design:paramtypes", [])
], MerchantService);
exports.MerchantService = MerchantService;
//# sourceMappingURL=merchant.service.js.map