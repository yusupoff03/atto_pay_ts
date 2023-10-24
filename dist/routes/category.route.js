"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "CategoryRoute", {
    enumerable: true,
    get: function() {
        return CategoryRoute;
    }
});
const _express = require("express");
const _categorycontroller = require("../controllers/category.controller");
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
let CategoryRoute = class CategoryRoute {
    initializeRoutes() {
        this.router.get(`${this.path}`, this.category.getAllCategory);
    }
    constructor(){
        _define_property(this, "path", '/category');
        _define_property(this, "router", (0, _express.Router)());
        _define_property(this, "category", new _categorycontroller.CategoryController());
        this.initializeRoutes();
    }
};

//# sourceMappingURL=category.route.js.map