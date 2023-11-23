"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "CategoryController", {
    enumerable: true,
    get: function() {
        return CategoryController;
    }
});
const _typedi = require("typedi");
const _categoryservice = require("../services/category.service");
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
let CategoryController = class CategoryController {
    constructor(){
        _define_property(this, "category", _typedi.Container.get(_categoryservice.CategoryService));
        _define_property(this, "getAllCategory", async (req, res, next)=>{
            try {
                const lang = req.acceptsLanguages('en', 'ru', 'uz') || 'en';
                const result = await this.category.getAllCategories(lang);
                res.status(200).send({
                    count: result.length,
                    categories: result
                });
            } catch (error) {
                next(error);
            }
        });
    }
};

//# sourceMappingURL=category.controller.js.map