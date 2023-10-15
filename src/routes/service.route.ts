import { Router } from 'express';
import { Routes } from '@interfaces/routes.interface';
import { ServiceController } from '@controllers/service.controller';

export class ServiceRoute implements Routes {
  path: '/merchant';
  router = Router();
  public service = new ServiceController();

  constructor() {
    this.initializeRoutes();
  }
  private initializeRoutes() {
    this.router.get(`${this.path}`);
    this.router.put(`${this.path}/update`);
  }
}
