"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionService = void 0;
const tslib_1 = require("tslib");
const typedi_1 = require("typedi");
const database_1 = tslib_1.__importDefault(require("../database"));
const CustomError_1 = require("../exceptions/CustomError");
const imageStorage_1 = require("../utils/imageStorage");
const moment_1 = tslib_1.__importDefault(require("moment"));
let TransactionService = class TransactionService {
    async payForService(customerId, serviceId, cardId) {
        const { rows } = await database_1.default.query(`call pay_for_service($1, $2, $3, null, null, null)`, [customerId, cardId, serviceId]);
        const { error_code, error_message, payment_id } = rows[0];
        if (error_code)
            throw new CustomError_1.CustomError(error_code, error_message);
        return payment_id;
    }
    async transferMoneyToSelf(customerId, fromCardId, toCardId, amount) {
        const { rows } = await database_1.default.query(`call transfer_money_to_self($1,$2,$3,$4,null,null,null)`, [customerId, fromCardId, toCardId, amount]);
        const { error_code, error_message, transfer_id } = rows[0];
        if (error_code) {
            throw new CustomError_1.CustomError(error_code, error_message);
        }
        return transfer_id;
    }
    async getTransactions(customerId, offset, fromDate, toDate, byCardId, byServiceId) {
        let transactions;
        fromDate = (0, moment_1.default)(fromDate, 'DD/MM/YYYY').startOf('day').add(offset, 'hours').toISOString();
        toDate = (0, moment_1.default)(toDate, 'DD/MM/YYYY').endOf('day').add(offset, 'hours').toISOString();
        const { rows } = await database_1.default.query(`select *
from get_transactions($1, $2, $3, $4, $5)
order by created_at desc, (type = 'income') desc;`, [customerId, fromDate, toDate, byCardId, byServiceId]);
        // eslint-disable-next-line prefer-const
        transactions = rows;
        transactions.forEach(t => {
            if (t.sender.image_url)
                t.sender.image_url = imageStorage_1.FileUploader.getUrl(t.sender.image_url);
            if (t.receiver.image_url)
                t.receiver.image_url = imageStorage_1.FileUploader.getUrl(t.receiver.image_url);
        });
        return transactions;
    }
};
TransactionService = tslib_1.__decorate([
    (0, typedi_1.Service)()
], TransactionService);
exports.TransactionService = TransactionService;
//# sourceMappingURL=transaction.service.js.map