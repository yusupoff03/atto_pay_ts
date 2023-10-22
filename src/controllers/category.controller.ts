import { NextFunction, Request, Response } from 'express';
import { Container } from 'typedi';
import { CategoryService } from '@services/category.service';
import { Category } from '@interfaces/category.interface';

export class CategoryController {
  public category = Container.get(CategoryService);

  public getAllCategory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const lang = req.acceptsLanguages('en', 'ru', 'uz') || 'en';
      const result: Category[] = await this.category.getAllCategories(lang);
      res.status(200).send({
        count: result.length,
        categories: result,
      });
    } catch (error) {
      next(error);
    }
  };
}
