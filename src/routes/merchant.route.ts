import { Router } from 'express';
import { Routes } from '@interfaces/routes.interface';
import { MerchantController } from '@controllers/merchant.controller';

export class MerchantRoute implements Routes {
  path: '/merchant';
  router = Router();
  public merchant = new MerchantController();

  constructor() {
    this.initializeRoutes();
  }
  private initializeRoutes() {
    this.router.get(`${this.path}`, this.merchant.getMerchantProfile);
    this.router.put(`${this.path}/update`, this.merchant.updateMerchant);
  }
}
