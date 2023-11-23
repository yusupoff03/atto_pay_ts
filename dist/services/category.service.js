"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryService = void 0;
const tslib_1 = require("tslib");
const typedi_1 = require("typedi");
const _database_1 = tslib_1.__importDefault(require("@database"));
let CategoryService = class CategoryService {
    async getAllCategories(lang) {
        const { rows } = await _database_1.default.query('select id, code, name -> $1 as name from service_category', [lang]);
        if (rows[0]) {
            return rows;
        }
        return [];
    }
};
CategoryService = tslib_1.__decorate([
    (0, typedi_1.Service)()
], CategoryService);
exports.CategoryService = CategoryService;
//# sourceMappingURL=category.service.js.map