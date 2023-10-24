"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "CurrencyService", {
    enumerable: true,
    get: function() {
        return CurrencyService;
    }
});
const _typedi = require("typedi");
const _database = /*#__PURE__*/ _interop_require_default(require("../database"));
const _httpException = require("../exceptions/httpException");
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
let CurrencyService = class CurrencyService {
    async createCurrency(currencyDto) {
        const { name, abbreviation } = currencyDto;
        const { rows } = await _database.default.query(`INSERT INTO currency(name,abbreviation) values ($1,$2) RETURNING *`, [
            name,
            abbreviation
        ]);
        if (!rows[0].exists) {
            throw new _httpException.HttpException(500, 'Database error');
        }
        return rows[0];
    }
    async updateCurrency(currencyUpdateDto) {
        const { id, name, abbreviation } = currencyUpdateDto;
        const { rows } = await _database.default.query(`SELECT * FROM currency where id=$1`, [
            id
        ]);
        if (!rows[0].exists) {
            throw new _httpException.HttpException(404, 'Currency not found');
        }
        const newName = name || rows[0].name;
        const newAbbreviation = abbreviation || rows[0].abbreviation;
        const { rows: currency } = await _database.default.query(`UPDATE currency SET name=$1,abbbreviation=$2 where id=$3 RETURNING *`, [
            id,
            newName,
            newAbbreviation
        ]);
        if (currency[0].exists) {
            return currency[0];
        }
        throw new _httpException.HttpException(500, 'Database error');
    }
    async deleteCurrency(id) {
        const { rows } = await _database.default.query(`Select * from currency where id=$1`, [
            id
        ]);
        if (!rows[0].exists) {
            throw new _httpException.HttpException(404, 'Currency not found');
        }
        _database.default.query(`delete from currency where id=$1`, [
            id
        ]);
        return true;
    }
    async getCurrencyById(id) {
        const { rows } = await _database.default.query(`Select * from currency where id=$1`, [
            id
        ]);
        if (!rows[0].exists) {
            throw new _httpException.HttpException(404, 'Currency not found');
        }
        return rows[0];
    }
};
CurrencyService = _ts_decorate([
    (0, _typedi.Service)()
], CurrencyService);

//# sourceMappingURL=currency,service.js.map