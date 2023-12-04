import { Routes } from '@interfaces/routes.interface';
import { Router } from 'express';
import { TransactionController } from '@controllers/transaction.controller';
import { AuthMiddleware } from '@middlewares/auth.middleware';
import { ValidationMiddleware } from '@middlewares/validation.middleware';
import { TransferMoneyDto } from '@dtos/transaction.dto';
import { TransportController } from '@controllers/transport.controller';

export class TransportRoute implements Routes {
  // path = '/atto';
  router = Router();
  private transport = new TransportController();
  constructor() {
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.get(`/metro-stations`, this.transport.getStations);
    this.router.post('/topup', AuthMiddleware, this.transport.topUpCard);
    // this.router.post('/qr/metro', this.transport.metroQrPay);
    // this.router.post('/qr/bus', this.transport.busQrPay);
    // this.router.get('/bus', this.transport.getBusInfo);
  }
}
