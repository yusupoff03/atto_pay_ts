import { Router } from 'express';
import { Routes } from '@interfaces/routes.interface';
import { ServiceController } from '@controllers/service.controller';
import { AuthMiddleware } from '@middlewares/auth.middleware';

export class ServiceRoute implements Routes {
  path = '/service';
  router = Router();
  public service = new ServiceController();

  constructor() {
    this.initializeRoutes();
  }
  private initializeRoutes() {
    this.router.get(`${this.path}/merchant`, AuthMiddleware, this.service.getMerchantServices);
    this.router.get(`${this.path}`, AuthMiddleware, this.service.getAllServices);
    this.router.get(`${this.path}/:id`, AuthMiddleware, this.service.getOneById);
    this.router.delete(`${this.path}`, AuthMiddleware, this.service.deleteOneById);
    this.router.put(`${this.path}`, AuthMiddleware, this.service.editService);
    this.router.post(`${this.path}`, AuthMiddleware, this.service.createService);
  }
}
