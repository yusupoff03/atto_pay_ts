import { NextFunction, Request, Response } from 'express';
import { CategoryService } from '@services/category.service';
export declare class CategoryController {
    category: CategoryService;
    getAllCategory: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}
