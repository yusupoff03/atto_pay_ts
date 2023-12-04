import { Router } from 'express';
import { Routes } from '@interfaces/routes.interface';
import { CardsController } from '@controllers/cards.controller';
import { ValidationMiddleware } from '@middlewares/validation.middleware';
import { CardForOtp, CardOwner, CreateCardDto } from '@dtos/card.dto';
import { AuthMiddleware } from '@middlewares/auth.middleware';
import { CreateTransportCardDto } from '@dtos/transport.card.dto';
export class CardsRoute implements Routes {
  path = '/customer/card';
  router = Router();
  public cards = new CardsController();
  constructor() {
    this.initializeRoutes();
  }
  private initializeRoutes() {
    this.router.post(`${this.path}`, ValidationMiddleware(CreateCardDto), this.cards.createCard);
    this.router.post(`${this.path}/otp`, ValidationMiddleware(CardForOtp), this.cards.newOtp);
    this.router.post(`${this.path}/owner`, AuthMiddleware, ValidationMiddleware(CardOwner), this.cards.getOwnerByPan);
    this.router.get(`${this.path}`, this.cards.getCustomerCards);
    this.router.get(`${this.path}/:id`, this.cards.getOneById);
    this.router.delete(`${this.path}`, this.cards.deleteCard);
    this.router.put(`${this.path}`, this.cards.updateCard);
  }
}
