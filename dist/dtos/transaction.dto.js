"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransferMoneyDto = void 0;
const tslib_1 = require("tslib");
const class_validator_1 = require("class-validator");
class TransferMoneyDto {
}
tslib_1.__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    tslib_1.__metadata("design:type", String)
], TransferMoneyDto.prototype, "fromCardId", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)()
    // @IsCreditCard()
    ,
    (0, class_validator_1.MinLength)(16),
    (0, class_validator_1.MaxLength)(16),
    tslib_1.__metadata("design:type", String)
], TransferMoneyDto.prototype, "toCardPan", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    tslib_1.__metadata("design:type", Number)
], TransferMoneyDto.prototype, "amount", void 0);
exports.TransferMoneyDto = TransferMoneyDto;
//# sourceMappingURL=transaction.dto.js.map