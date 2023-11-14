"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginTypeDto = exports.CustomerLoginDto = exports.UpdateCustomerDto = exports.CreateCustomerDto = void 0;
const tslib_1 = require("tslib");
const class_validator_1 = require("class-validator");
class CreateCustomerDto {
}
tslib_1.__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], CreateCustomerDto.prototype, "name", void 0);
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
exports.UpdateCustomerDto = UpdateCustomerDto;
class CustomerLoginDto {
}
tslib_1.__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    tslib_1.__metadata("design:type", String)
], CustomerLoginDto.prototype, "phone", void 0);
exports.CustomerLoginDto = CustomerLoginDto;
class LoginTypeDto {
}
tslib_1.__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(12),
    (0, class_validator_1.MaxLength)(12),
    (0, class_validator_1.Matches)(/^998\d{9}$/, {
        message: ` `,
    }),
    tslib_1.__metadata("design:type", String)
], LoginTypeDto.prototype, "phone", void 0);
exports.LoginTypeDto = LoginTypeDto;
//# sourceMappingURL=customer.dto.js.map