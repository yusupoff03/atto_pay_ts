import { Routes } from '../interfaces/routes.interface';
import { CategoryController } from '../controllers/category.controller';
export declare class CategoryRoute implements Routes {
    path: string;
    router: import("express-serve-static-core").Router;
    category: CategoryController;
    constructor();
    private initializeRoutes;
}
