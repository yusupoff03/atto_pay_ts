import { Router } from 'express';
import { Routes } from '@interfaces/routes.interface';
import { MerchantController } from '@controllers/merchant.controller';
import { AuthController } from '@controllers/auth.controller';
import { AuthMiddleware } from '@middlewares/auth.middleware';
import { ValidationMiddleware } from '@middlewares/validation.middleware';
import { CreateMerchantDto } from '@dtos/merchant.dto';

export class MerchantRoute implements Routes {
  path = '/merchant';
  router = Router();
  public merchant = new MerchantController();
  public auth = new AuthController();

  constructor() {
    this.initializeRoutes();
  }
  private initializeRoutes() {
    this.router.get(`${this.path}/profile`, AuthMiddleware, this.merchant.getMerchantProfile);
    this.router.post(`${this.path}/login`, this.auth.loginMerchant);
    this.router.post(`${this.path}/send-code`, this.auth.sendCode);
    this.router.post(`${this.path}/register`, ValidationMiddleware(CreateMerchantDto), this.auth.signUpMerchant);
    this.router.put(`${this.path}/update`, AuthMiddleware, this.merchant.updateMerchant);
    this.router.put(`${this.path}/lang`, AuthMiddleware, this.merchant.updateMerchantLang);
  }
}
