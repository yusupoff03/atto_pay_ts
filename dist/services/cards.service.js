"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "CardsService", {
    enumerable: true,
    get: function() {
        return CardsService;
    }
});
const _typedi = require("typedi");
const _database = /*#__PURE__*/ _interop_require_default(require("../database"));
const _CustomError = require("../exceptions/CustomError");
const _test = require("../test");
const _cardrequestservice = require("./cardrequest.service");
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
let CardsService = class CardsService {
    async createCard(cardDto, customerId, lang) {
        const name = cardDto.name;
        const pan = cardDto.pan;
        const owner_name = cardDto.owner_name;
        const expiry_month = cardDto.expiry_month;
        const expiry_year = cardDto.expiry_year;
        const response = await _cardrequestservice.CardRequestService.CardVerify(cardDto.id, cardDto.code);
        console.log(response);
        if (response.data.error) throw new _CustomError.CustomError('WRONG_OTP');
        const { rows } = await _database.default.query(`Select *
from customer_card
where pan = $1`, [
            pan
        ]);
        if (rows[0]) {
            throw new _CustomError.CustomError('CARD_ALREADY_ADDED');
        }
        const { rows: cardRows } = await _database.default.query(`INSERT INTO customer_card( customer_id,name, owner_name,pan, expiry_month, expiry_year)
       values ($1, $2, $3, $4, $5,$6) returning (select message from message where name = 'CARD_ADDED')`, [
            customerId,
            name,
            owner_name,
            pan,
            expiry_month,
            expiry_year
        ]);
        return cardRows[0].message[lang];
    }
    async newOtp(cardForOtp, lang) {
        const { rows } = await _database.default.query('Select * from customer_card where pan=$1', [
            cardForOtp.pan
        ]);
        if (rows[0]) throw new _CustomError.CustomError('CARD_BELONGS_TO_ANOTHER');
        const expiry = `${cardForOtp.expiry_year}${cardForOtp.expiry_month}`;
        const response = await _cardrequestservice.CardRequestService.cardNewOtp(cardForOtp.pan, expiry);
        console.log(response);
        if (response.data.error) throw new _CustomError.CustomError('CARD_NOT_FOUND');
        return response.data.result.id;
    }
    async getCustomerCards(customerId) {
        const { rows } = await _database.default.query(`Select *, mask_credit_card(pan) as pan from customer_card where customer_id = $1`, [
            customerId
        ]);
        if (!rows[0]) {
            return [];
        }
        return rows;
    }
    async updateCard(customerId, cardDto, lang) {
        const { name, id } = cardDto;
        const { rows } = await _database.default.query(`UPDATE customer_card
                                     SET name=$1
                                     where id = $2
                                       and customer_id = $3 RETURNING (select message from message where name = 'CARD_UPDATED')`, [
            name,
            id,
            customerId
        ]);
        if (!rows[0]) {
            throw new _CustomError.CustomError('CARD_NOT_FOUND');
        }
        return rows[0].message[lang];
    }
    async deleteCard(customerId, cardId, lang) {
        const { rows } = await _database.default.query(`Select * from customer_card where id=$1 and customer_id=$2`, [
            cardId,
            customerId
        ]);
        if (!rows[0]) {
            throw new _CustomError.CustomError('CARD_NOT_FOUND');
        }
        const { rows: error } = await _database.default.query('call delete_card($1,$2,null,null)', [
            cardId,
            customerId
        ]);
        if (error[0].error_code) {
            throw new _CustomError.CustomError(error[0].error_code, error[0].error_message);
        }
        const { rows: message } = await _database.default.query(`Select message from message where name = 'CARD_DELETED'`);
        return message[0].message[lang];
    }
    async getOneById(customerId, cardId) {
        const { rows } = await _database.default.query(`Select * from customer_card where id= $1  and customer_id = $2`, [
            cardId,
            customerId
        ]);
        if (!rows[0]) throw new _CustomError.CustomError('CARD_NOT_FOUND');
        return rows[0];
    }
    async addTransportCard(card, customerId, lang) {
        const name = card.name;
        const pan = card.pan;
        const owner_name = card.owner_name;
        const expiry_month = card.expiry_month;
        const expiry_year = card.expiry_year;
        const { rows } = await _database.default.query(`Select *
from customer_card
where pan = $1`, [
            pan
        ]);
        if (rows[0]) {
            throw new _CustomError.CustomError('CARD_ALREADY_ADDED');
        }
        const response = await (0, _test.request)(pan);
        const { rows: cardRows } = await _database.default.query(`INSERT INTO customer_card( customer_id,name, owner_name,pan, expiry_month, expiry_year,balance)
       values ($1, $2, $3, $4, $5,$6,$7) returning (select message from message where name = 'CARD_ADDED')`, [
            customerId,
            name,
            owner_name,
            pan,
            expiry_month,
            expiry_year,
            response.data.data.balance
        ]);
        return cardRows[0].message[lang];
    }
    async getOwnerByPan(pan) {
        const { rows } = await _database.default.query(`Select name from customer where id=(Select customer_id from customer_card  where  pan = $1)`, [
            pan
        ]);
        if (!rows[0]) throw new _CustomError.CustomError('CARD_NOT_FOUND');
        return rows[0];
    }
};
CardsService = _ts_decorate([
    (0, _typedi.Service)()
], CardsService);

//# sourceMappingURL=cards.service.js.map