"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "CustomError", {
    enumerable: true,
    get: function() {
        return CustomError;
    }
});
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
let CustomError = class CustomError extends Error {
    constructor(name, originalMessage, info){
        super(originalMessage || name);
        _define_property(this, "info", void 0 // Specify the type for 'info'
        );
        this.name = name;
        this.info = info || undefined; // Set 'info' explicitly as undefined if not provided
    }
};

//# sourceMappingURL=CustomError.js.map