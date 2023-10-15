import { Router } from 'express';
import { Routes } from '@interfaces/routes.interface';
import { CurrencyController } from '@controllers/currency.controller';
import { ValidationMiddleware } from '@middlewares/validation.middleware';
import { CurrencyUpdateDto, CurrencyCreateDto } from '@dtos/currency.dto';

export class CurrencyRoute implements Routes {
  path: '/currency';
  router = Router();
  public currency = new CurrencyController();
  constructor() {
    this.initializeRoutes();
  }
  private initializeRoutes() {
    this.router.get(`${this.path}`, this.currency.getCurrency);
    this.router.post(`${this.path}`, ValidationMiddleware(CurrencyCreateDto), this.currency.createCurrency);
    this.router.put(`${this.path}`, ValidationMiddleware(CurrencyUpdateDto), this.currency.updateCurrency);
    this.router.delete(`${this.path}`, this.currency.deleteCurrency);
  }
}
