"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailSenderDto = exports.MerchantLoginDto = exports.CreateMerchantDto = void 0;
const tslib_1 = require("tslib");
const class_validator_1 = require("class-validator");
class CreateMerchantDto {
}
tslib_1.__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    tslib_1.__metadata("design:type", String)
], CreateMerchantDto.prototype, "name", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsEmail)(),
    tslib_1.__metadata("design:type", String)
], CreateMerchantDto.prototype, "email", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsAlphanumeric)(),
    (0, class_validator_1.MinLength)(7),
    tslib_1.__metadata("design:type", String)
], CreateMerchantDto.prototype, "password", void 0);
exports.CreateMerchantDto = CreateMerchantDto;
class MerchantLoginDto {
}
tslib_1.__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsEmail)(),
    tslib_1.__metadata("design:type", String)
], MerchantLoginDto.prototype, "email", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsAlphanumeric)(),
    (0, class_validator_1.MinLength)(7),
    tslib_1.__metadata("design:type", String)
], MerchantLoginDto.prototype, "password", void 0);
exports.MerchantLoginDto = MerchantLoginDto;
class EmailSenderDto {
}
tslib_1.__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsEmail)(),
    tslib_1.__metadata("design:type", String)
], EmailSenderDto.prototype, "email", void 0);
exports.EmailSenderDto = EmailSenderDto;
//# sourceMappingURL=merchant.dto.js.map