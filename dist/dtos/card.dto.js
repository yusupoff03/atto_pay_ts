"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CardOwner = exports.CardUpdateDto = exports.CreateCardDto = void 0;
const tslib_1 = require("tslib");
const class_validator_1 = require("class-validator");
class CreateCardDto {
}
tslib_1.__decorate([
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], CreateCardDto.prototype, "name", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(16),
    (0, class_validator_1.MaxLength)(16),
    (0, class_validator_1.IsNotEmpty)(),
    tslib_1.__metadata("design:type", String)
], CreateCardDto.prototype, "pan", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    tslib_1.__metadata("design:type", String)
], CreateCardDto.prototype, "expiry_month", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], CreateCardDto.prototype, "expiry_year", void 0);
exports.CreateCardDto = CreateCardDto;
class CardUpdateDto {
}
tslib_1.__decorate([
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], CardUpdateDto.prototype, "name", void 0);
exports.CardUpdateDto = CardUpdateDto;
class CardOwner {
}
tslib_1.__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.Matches)(/\b(?:\d[ -]*?){16}\b/),
    tslib_1.__metadata("design:type", String)
], CardOwner.prototype, "pan", void 0);
exports.CardOwner = CardOwner;
//# sourceMappingURL=card.dto.js.map