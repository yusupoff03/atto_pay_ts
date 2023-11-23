"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    CreateCustomerDto: function() {
        return CreateCustomerDto;
    },
    UpdateCustomerDto: function() {
        return UpdateCustomerDto;
    },
    CustomerLoginDto: function() {
        return CustomerLoginDto;
    },
    LoginTypeDto: function() {
        return LoginTypeDto;
    },
    LoginQr: function() {
        return LoginQr;
    },
    VerifyDto: function() {
        return VerifyDto;
    }
});
const _classvalidator = require("class-validator");
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
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let CreateCustomerDto = class CreateCustomerDto {
    constructor(){
        _define_property(this, "name", void 0);
        _define_property(this, "phone", void 0);
        _define_property(this, "password", void 0);
    }
};
_ts_decorate([
    (0, _classvalidator.IsNotEmpty)(),
    (0, _classvalidator.IsString)(),
    _ts_metadata("design:type", String)
], CreateCustomerDto.prototype, "name", void 0);
_ts_decorate([
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.IsNotEmpty)(),
    (0, _classvalidator.MinLength)(6),
    (0, _classvalidator.MaxLength)(32),
    _ts_metadata("design:type", String)
], CreateCustomerDto.prototype, "password", void 0);
let UpdateCustomerDto = class UpdateCustomerDto {
    constructor(){
        _define_property(this, "name", void 0);
        _define_property(this, "image", void 0);
        _define_property(this, "deleteImage", void 0);
        _define_property(this, "gender", void 0);
        _define_property(this, "birthDate", void 0);
    }
};
_ts_decorate([
    (0, _classvalidator.IsString)(),
    _ts_metadata("design:type", String)
], UpdateCustomerDto.prototype, "name", void 0);
let CustomerLoginDto = class CustomerLoginDto {
    constructor(){
        _define_property(this, "phone", void 0);
        _define_property(this, "password", void 0);
        _define_property(this, "otp", void 0);
    }
};
_ts_decorate([
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.IsNotEmpty)(),
    _ts_metadata("design:type", String)
], CustomerLoginDto.prototype, "phone", void 0);
let LoginTypeDto = class LoginTypeDto {
    constructor(){
        _define_property(this, "phone", void 0);
    }
};
_ts_decorate([
    (0, _classvalidator.IsNotEmpty)(),
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.MinLength)(12),
    (0, _classvalidator.MaxLength)(12),
    (0, _classvalidator.Matches)(/^998\d{9}$/, {
        message: ` `
    }),
    _ts_metadata("design:type", String)
], LoginTypeDto.prototype, "phone", void 0);
let LoginQr = class LoginQr {
    constructor(){
        _define_property(this, "key", void 0);
        _define_property(this, "allowDeviceId", void 0);
    }
};
_ts_decorate([
    (0, _classvalidator.IsNotEmpty)(),
    (0, _classvalidator.IsString)(),
    _ts_metadata("design:type", String)
], LoginQr.prototype, "key", void 0);
_ts_decorate([
    (0, _classvalidator.IsNotEmpty)(),
    (0, _classvalidator.IsString)(),
    _ts_metadata("design:type", String)
], LoginQr.prototype, "allowDeviceId", void 0);
let VerifyDto = class VerifyDto {
    constructor(){
        _define_property(this, "phone", void 0);
    }
};
_ts_decorate([
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.IsNotEmpty)(),
    (0, _classvalidator.Matches)(/^998\d{9}$/, {
        message: ` `
    }),
    _ts_metadata("design:type", String)
], VerifyDto.prototype, "phone", void 0);

//# sourceMappingURL=customer.dto.js.map