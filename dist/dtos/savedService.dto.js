"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SavedServiceDto = void 0;
const tslib_1 = require("tslib");
const class_validator_1 = require("class-validator");
class SavedServiceDto {
}
tslib_1.__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    tslib_1.__metadata("design:type", String)
], SavedServiceDto.prototype, "serviceId", void 0);
exports.SavedServiceDto = SavedServiceDto;
//# sourceMappingURL=savedService.dto.js.map