"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CurrencyUpdateDto = exports.CurrencyCreateDto = void 0;
const tslib_1 = require("tslib");
const class_validator_1 = require("class-validator");
class CurrencyCreateDto {
}
tslib_1.__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.MaxLength)(10),
    tslib_1.__metadata("design:type", String)
], CurrencyCreateDto.prototype, "name", void 0);
exports.CurrencyCreateDto = CurrencyCreateDto;
class CurrencyUpdateDto {
}
exports.CurrencyUpdateDto = CurrencyUpdateDto;
//# sourceMappingURL=currency.dto.js.map