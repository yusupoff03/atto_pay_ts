import { Router } from 'express';
import { Routes } from '@interfaces/routes.interface';
import { CategoryController } from '@controllers/category.controller';

export class CategoryRoute implements Routes {
  path = '/category';
  router = Router();
  public category = new CategoryController();
  constructor() {
    this.initializeRoutes();
  }
  private initializeRoutes() {
    this.router.get(`${this.path}`, this.category.getAllCategory);
  }
}
