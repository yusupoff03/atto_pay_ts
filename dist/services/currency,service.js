"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CurrencyService = void 0;
const tslib_1 = require("tslib");
const typedi_1 = require("typedi");
const _database_1 = tslib_1.__importDefault(require("../database"));
const httpException_1 = require("../exceptions/httpException");
let CurrencyService = class CurrencyService {
    async createCurrency(currencyDto) {
        const { name, abbreviation } = currencyDto;
        const { rows } = await _database_1.default.query(`INSERT INTO currency(name,abbreviation) values ($1,$2) RETURNING *`, [name, abbreviation]);
        if (!rows[0].exists) {
            throw new httpException_1.HttpException(500, 'Database error');
        }
        return rows[0];
    }
    async updateCurrency(currencyUpdateDto) {
        const { id, name, abbreviation } = currencyUpdateDto;
        const { rows } = await _database_1.default.query(`SELECT * FROM currency where id=$1`, [id]);
        if (!rows[0].exists) {
            throw new httpException_1.HttpException(404, 'Currency not found');
        }
        const newName = name || rows[0].name;
        const newAbbreviation = abbreviation || rows[0].abbreviation;
        const { rows: currency } = await _database_1.default.query(`UPDATE currency SET name=$1,abbbreviation=$2 where id=$3 RETURNING *`, [id, newName, newAbbreviation]);
        if (currency[0].exists) {
            return currency[0];
        }
        throw new httpException_1.HttpException(500, 'Database error');
    }
    async deleteCurrency(id) {
        const { rows } = await _database_1.default.query(`Select * from currency where id=$1`, [id]);
        if (!rows[0].exists) {
            throw new httpException_1.HttpException(404, 'Currency not found');
        }
        await _database_1.default.query(`delete from currency where id=$1`, [id]);
        return true;
    }
    async getCurrencyById(id) {
        const { rows } = await _database_1.default.query(`Select * from currency where id=$1`, [id]);
        if (!rows[0].exists) {
            throw new httpException_1.HttpException(404, 'Currency not found');
        }
        return rows[0];
    }
};
CurrencyService = tslib_1.__decorate([
    (0, typedi_1.Service)()
], CurrencyService);
exports.CurrencyService = CurrencyService;
//# sourceMappingURL=currency,service.js.map