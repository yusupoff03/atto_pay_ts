import { Router } from 'express';
import { Routes } from '@interfaces/routes.interface';
import { TransactionController } from '@controllers/transaction.controller';
import { AuthMiddleware } from '@middlewares/auth.middleware';

export class TransactionRoute implements Routes {
  path = '/transaction';
  router = Router();
  private transaction = new TransactionController();
  constructor() {
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.post(`${this.path}/pay`, AuthMiddleware, this.transaction.pay);
    this.router.post(`${this.path}/transfer/self`, AuthMiddleware, this.transaction.transferToSelf);
    this.router.post(`${this.path}`, AuthMiddleware, this.transaction.getCustomerTransactions);
  }
}
