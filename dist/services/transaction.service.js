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
    async payForService(customerId, serviceId, cardId) {
        const { rows } = await _database.default.query(`call pay_for_service($1, $2, $3, null, null, null)`, [
            customerId,
            cardId,
            serviceId
        ]);
        const { error_code, error_message, payment_id } = rows[0];
        if (error_code) throw new _CustomError.CustomError(error_code, error_message);
        return payment_id;
    }
    async transferMoneyToSelf(customerId, fromCardId, toCardId, amount) {
        const { rows } = await _database.default.query(`call transfer_money_to_self($1,$2,$3,$4,null,null,null)`, [
            customerId,
            fromCardId,
            toCardId,
            amount
        ]);
        const { error_code, error_message, transfer_id } = rows[0];
        if (error_code) {
            throw new _CustomError.CustomError(error_code, error_message);
        }
        return transfer_id;
    }
    async getTransactions(customerId, offset, fromDate, toDate, byCardId, byServiceId) {
        let transactions;
        fromDate = (0, _moment.default)(fromDate, 'DD/MM/YYYY').startOf('day').add(offset, 'hours').toISOString();
        toDate = (0, _moment.default)(toDate, 'DD/MM/YYYY').endOf('day').add(offset, 'hours').toISOString();
        const { rows } = await _database.default.query(`select *
from get_transactions($1, $2, $3, $4, $5)
order by created_at desc, (type = 'income') desc;`, [
            customerId,
            fromDate,
            toDate,
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
};
TransactionService = _ts_decorate([
    (0, _typedi.Service)()
], TransactionService);

//# sourceMappingURL=transaction.service.js.map