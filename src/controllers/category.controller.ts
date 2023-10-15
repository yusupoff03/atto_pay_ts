import { NextFunction, Request, Response } from 'express';
import { Container } from 'typedi';
import { CategoryService } from '@services/category.service';
import { Category } from '@interfaces/category.interface';

export class CategoryController {
  public category = Container.get(CategoryService);

  public getAllCategory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const categories: Category[] = await this.category.getAllCategories();

      res.status(200).json({
        data: categories,
      });
    } catch (error) {
      next(error);
    }
  };
}
