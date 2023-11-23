"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "TransactionService", {
    enumerable: true,
    get: function() {
        return TransactionService;
    }
});
const _typedi = require("typedi");
const _database = /*#__PURE__*/ _interop_require_default(require("database"));
const _CustomError = require("../exceptions/CustomError");
const _imageStorage = require("../utils/imageStorage");
const _moment = /*#__PURE__*/ _interop_require_default(require("moment"));
const _pg = require("pg");
const _config = require("../config");
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
let TransactionService = class TransactionService {
    async payForService(customerId, serviceId, cardId, amount, fields) {
        const pool = new _pg.Pool({
            connectionString: _config.POSTGRES_URL,
            ssl: _config.POSTGRES_SSL === 'true'
        });
        const client = await pool.connect();
        try {
            await client.query('BEGIN');
            const cardQuery = 'SELECT * FROM customer_card WHERE id = $1 AND customer_id = $2';
            const cardResult = await client.query(cardQuery, [
                cardId,
                customerId
            ]);
            if (!cardResult.rows[0]) {
                throw new _CustomError.CustomError('CARD_NOT_FOUND');
            }
            const card = cardResult.rows[0];
            const serviceQuery = 'SELECT * FROM service WHERE id = $1';
            const serviceResult = await client.query(serviceQuery, [
                serviceId
            ]);
            if (!serviceResult.rows[0]) {
                throw new _CustomError.CustomError('SERVICE_NOT_FOUND');
            }
            const service = serviceResult.rows[0];
            const merchantQuery = 'SELECT * FROM merchant WHERE id = $1';
            const merchantResult = await client.query(merchantQuery, [
                service.merchant_id
            ]);
            const merchant = merchantResult.rows[0];
            if (card.balance < amount) {
                throw new _CustomError.CustomError('INSUFFICIENT_FUNDS');
            }
            await client.query('UPDATE customer_card SET balance = $1 WHERE id = $2', [
                card.balance - amount,
                card.id
            ]);
            await client.query('UPDATE merchant SET balance = $1 WHERE id = $2', [
                parseFloat(merchant.balance) + parseInt(amount),
                merchant.id
            ]);
            const paymentQuery = `
        INSERT INTO payment (owner_id, type, amount, sender_id, receiver_id, fields)
        VALUES ($1, 'expense', $2, $3, $4, $5) RETURNING id
      `;
            const paymentResult = await client.query(paymentQuery, [
                customerId,
                amount,
                card.id,
                serviceId,
                JSON.stringify(fields || {})
            ]);
            const merchantPaymentQuery = `
        INSERT INTO payment (owner_id, type, amount, sender_id, receiver_id, fields)
        VALUES ($1, 'income', $2, $3, $4, $5)
      `;
            await client.query(merchantPaymentQuery, [
                service.merchant_id,
                amount,
                customerId,
                serviceId,
                JSON.stringify(fields || {})
            ]);
            const messageQuery = 'SELECT message FROM message WHERE name = $1';
            const messageResult = await client.query(messageQuery, [
                'PAYMENT_SUCCESS'
            ]);
            const success_message = messageResult.rows[0].message;
            await client.query('COMMIT');
            return {
                success_message,
                id: paymentResult.rows[0].id
            };
        } catch (e) {
            await client.query('ROLLBACK');
            throw e;
        } finally{
            client.release();
        }
    }
    async transferMoneyToSelf(customerId, fromCardId, toCardId, amount) {
        const { rows } = await _database.default.query(`call transfer_money_to_self($1,$2,$3,$4,null,null,null,null)`, [
            customerId,
            fromCardId,
            toCardId,
            amount
        ]);
        const { error_code, error_message, transfer_id, success_message } = rows[0];
        if (error_code) {
            throw new _CustomError.CustomError(error_code, error_message);
        }
        return {
            success_message,
            transfer_id
        };
    }
    async getTransactions(customerId, offset, fromDate, toDate, byCardId, byServiceId, page, limit) {
        let transactions;
        fromDate = (0, _moment.default)(fromDate, 'DD/MM/YYYY').startOf('day').add(offset, 'hours').toISOString();
        toDate = (0, _moment.default)(toDate, 'DD/MM/YYYY').endOf('day').add(offset, 'hours').toISOString();
        const { rows } = await _database.default.query(`select *
       from get_transactions($1, $2, $3, $4, $5, $6, $7)
       order by created_at desc, (type = 'income') desc;`, [
            customerId,
            fromDate,
            toDate,
            page,
            limit,
            byCardId,
            byServiceId
        ]);
        // eslint-disable-next-line prefer-const
        transactions = rows;
        transactions.forEach((t)=>{
            if (t.sender.image_url) t.sender.image_url = _imageStorage.FileUploader.getUrl(t.sender.image_url);
            if (t.receiver.image_url) t.receiver.image_url = _imageStorage.FileUploader.getUrl(t.receiver.image_url);
        });
        return transactions;
    }
    async transferMoney(customerId, fromCardId, toCardPan, amount, lang) {
        const { rows } = await _database.default.query(`call transfer_money($1,$2,$3,$4,null,null,null,null)`, [
            customerId,
            fromCardId,
            toCardPan,
            amount
        ]);
        const { error_code, error_message, transfer_id, success_message } = rows[0];
        if (error_code) throw new _CustomError.CustomError(error_code, error_message);
        const message = success_message[lang];
        return {
            transfer_id,
            message
        };
    }
    constructor(){
        _define_property(this, "function", void 0);
    }
};
TransactionService = _ts_decorate([
    (0, _typedi.Service)()
], TransactionService);

//# sourceMappingURL=transaction.service.js.map