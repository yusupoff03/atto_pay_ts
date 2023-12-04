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
    CreateCardDto: function() {
        return CreateCardDto;
    },
    CardUpdateDto: function() {
        return CardUpdateDto;
    },
    CardOwner: function() {
        return CardOwner;
    },
    CardForOtp: function() {
        return CardForOtp;
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
let CreateCardDto = class CreateCardDto {
    constructor(){
        _define_property(this, "name", void 0);
        _define_property(this, "pan", void 0);
        _define_property(this, "expiry_month", void 0);
        _define_property(this, "expiry_year", void 0);
        _define_property(this, "owner_name", void 0);
        _define_property(this, "code", void 0);
    }
};
_ts_decorate([
    (0, _classvalidator.IsString)(),
    _ts_metadata("design:type", String)
], CreateCardDto.prototype, "name", void 0);
_ts_decorate([
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.MinLength)(16),
    (0, _classvalidator.MaxLength)(16),
    (0, _classvalidator.IsNotEmpty)(),
    (0, _classvalidator.Matches)(/^(8600|5614|9987)\d{12}$/),
    _ts_metadata("design:type", String)
], CreateCardDto.prototype, "pan", void 0);
_ts_decorate([
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.IsNotEmpty)(),
    _ts_metadata("design:type", String)
], CreateCardDto.prototype, "expiry_month", void 0);
_ts_decorate([
    (0, _classvalidator.IsNotEmpty)(),
    (0, _classvalidator.IsString)(),
    _ts_metadata("design:type", String)
], CreateCardDto.prototype, "expiry_year", void 0);
_ts_decorate([
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.IsNotEmpty)(),
    _ts_metadata("design:type", String)
], CreateCardDto.prototype, "code", void 0);
let CardUpdateDto = class CardUpdateDto {
    constructor(){
        _define_property(this, "id", void 0);
        _define_property(this, "name", void 0);
    }
};
_ts_decorate([
    (0, _classvalidator.IsString)(),
    _ts_metadata("design:type", String)
], CardUpdateDto.prototype, "name", void 0);
let CardOwner = class CardOwner {
    constructor(){
        _define_property(this, "pan", void 0);
    }
};
_ts_decorate([
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.IsNotEmpty)(),
    (0, _classvalidator.Matches)(/^(8600|5614|9987)\d{12}$/),
    _ts_metadata("design:type", String)
], CardOwner.prototype, "pan", void 0);
let CardForOtp = class CardForOtp {
    constructor(){
        _define_property(this, "pan", void 0);
        _define_property(this, "expiry_month", void 0);
        _define_property(this, "expiry_year", void 0);
    }
};
_ts_decorate([
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.MinLength)(16),
    (0, _classvalidator.MaxLength)(16),
    (0, _classvalidator.IsNotEmpty)(),
    (0, _classvalidator.Matches)(/^(8600|5614)\d{12}$/),
    _ts_metadata("design:type", String)
], CardForOtp.prototype, "pan", void 0);
_ts_decorate([
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.IsNotEmpty)(),
    _ts_metadata("design:type", String)
], CardForOtp.prototype, "expiry_month", void 0);
_ts_decorate([
    (0, _classvalidator.IsNotEmpty)(),
    (0, _classvalidator.IsString)(),
    _ts_metadata("design:type", String)
], CardForOtp.prototype, "expiry_year", void 0);

//# sourceMappingURL=card.dto.js.map