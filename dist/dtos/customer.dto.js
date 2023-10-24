"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomerLoginDto = exports.UpdateCustomerDto = exports.CreateCustomerDto = void 0;
const tslib_1 = require("tslib");
const class_validator_1 = require("class-validator");
class CreateCustomerDto {
}
tslib_1.__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.MinLength)(6),
    (0, class_validator_1.MaxLength)(32),
    tslib_1.__metadata("design:type", String)
], CreateCustomerDto.prototype, "password", void 0);
exports.CreateCustomerDto = CreateCustomerDto;
class UpdateCustomerDto {
}
tslib_1.__decorate([
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], UpdateCustomerDto.prototype, "name", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    tslib_1.__metadata("design:type", String)
], UpdateCustomerDto.prototype, "password", void 0);
exports.UpdateCustomerDto = UpdateCustomerDto;
class CustomerLoginDto {
}
exports.CustomerLoginDto = CustomerLoginDto;
//# sourceMappingURL=customer.dto.js.map