"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryRoute = void 0;
const express_1 = require("express");
const category_controller_1 = require("../controllers/category.controller");
class CategoryRoute {
    constructor() {
        this.path = '/category';
        this.router = (0, express_1.Router)();
        this.category = new category_controller_1.CategoryController();
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.get(`${this.path}`, this.category.getAllCategory);
    }
}
exports.CategoryRoute = CategoryRoute;
//# sourceMappingURL=category.route.js.map