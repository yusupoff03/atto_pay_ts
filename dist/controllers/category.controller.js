"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryController = void 0;
const typedi_1 = require("typedi");
const category_service_1 = require("@services/category.service");
class CategoryController {
    constructor() {
        this.category = typedi_1.Container.get(category_service_1.CategoryService);
        this.getAllCategory = async (req, res, next) => {
            try {
                const lang = req.acceptsLanguages('en', 'ru', 'uz') || 'en';
                const result = await this.category.getAllCategories(lang);
                res.status(200).send({
                    count: result.length,
                    categories: result,
                });
            }
            catch (error) {
                next(error);
            }
        };
    }
}
exports.CategoryController = CategoryController;
//# sourceMappingURL=category.controller.js.map