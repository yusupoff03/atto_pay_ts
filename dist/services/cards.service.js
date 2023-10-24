"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CardsService = void 0;
const tslib_1 = require("tslib");
const typedi_1 = require("typedi");
const _database_1 = tslib_1.__importDefault(require("../database"));
const CustomError_1 = require("../exceptions/CustomError");
let CardsService = class CardsService {
    async createCard(cardDto, customerId, lang) {
        const name = cardDto.name;
        const pan = cardDto.pan;
        const owner_name = cardDto.owner_name;
        const expiry_month = cardDto.expiry_month;
        const expiry_year = cardDto.expiry_year;
        const { rows } = await _database_1.default.query(`Select *
from customer_card
where pan = $1`, [pan]);
        if (rows[0]) {
            throw new CustomError_1.CustomError('CARD_ALREADY_ADDED');
        }
        const { rows: cardRows } = await _database_1.default.query(`INSERT INTO customer_card( customer_id,name, owner_name,pan, expiry_month, expiry_year)
       values ($1, $2, $3, $4, $5,$6) returning (select message from message where name = 'CARD_ADDED')`, [customerId, name, owner_name, pan, expiry_month, expiry_year]);
        return cardRows[0].message[lang];
    }
    async getCustomerCards(customerId) {
        const { rows } = await _database_1.default.query(`Select *, mask_credit_card(pan) as pan from customer_card where customer_id = $1`, [customerId]);
        if (!rows[0]) {
            return [];
        }
        return rows;
    }
    async updateCard(customerId, cardDto) {
        const { name, id } = cardDto;
        const { rows } = await _database_1.default.query(`UPDATE customer_card
                                     SET name=$1
                                     where id = $2
                                       and customer_id = $3 RETURNING *`, [name, id, customerId]);
        if (!rows[0]) {
            throw new CustomError_1.CustomError('CARD_NOT_FOUND');
        }
        return rows[0];
    }
    async deleteCard(customerId, cardId) {
        const { rows } = await _database_1.default.query(`Select * from customer_card where id=$1 and customer_id=$2`, [cardId, customerId]);
        console.log(cardId);
        console.log(customerId);
        if (!rows[0]) {
            throw new CustomError_1.CustomError('CARD_NOT_FOUND');
        }
        const { rows: error } = await _database_1.default.query('call delete_card($1,$2,null,null)', [cardId, customerId]);
        if (error[0].error_code) {
            throw new CustomError_1.CustomError(error[0].error_code, error[0].error_message);
        }
        return true;
    }
    async getOneById(customerId, cardId) {
        const { rows } = await _database_1.default.query(`Select * from customer_card where id= $1  and customer_id = $2`, [cardId, customerId]);
        if (!rows[0])
            throw new CustomError_1.CustomError('CARD_NOT_FOUND');
        return rows[0];
    }
    async getOwnerByPan(pan) {
        const { rows } = await _database_1.default.query(`Select name from customer where id=(Select customer_id from customer_card  where  pan = $1)`, [pan]);
        if (!rows[0])
            throw new CustomError_1.CustomError('CARD_NOT_FOUND');
        return rows[0];
    }
};
CardsService = tslib_1.__decorate([
    (0, typedi_1.Service)()
], CardsService);
exports.CardsService = CardsService;
//# sourceMappingURL=cards.service.js.map