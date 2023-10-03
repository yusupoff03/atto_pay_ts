import { Router } from 'express';
import { Routes } from '@interfaces/routes.interface';
import { CardsController } from '@controllers/cards.controller';
import { ValidationMiddleware } from '@middlewares/validation.middleware';
import { CreateCardDto } from '@dtos/card.dto';
import { CardUpdateDto } from '@dtos/card.dto';
export class CardsRoute implements Routes {
  path: '/cards';
  router = Router();
  public cards = new CardsController();
  constructor() {
    this.initializeRoutes();
  }
  private initializeRoutes() {
    this.router.post(`${this.path}`, ValidationMiddleware(CreateCardDto), this.cards.createCard);
    this.router.get(`${this.path}`, this.cards.getCustomerCards);
    this.router.delete(`${this.path}`, this.cards.deleteCard);
    this.router.put(`${this.path}`, ValidationMiddleware(CardUpdateDto), this.cards.updateCard);
  }
}
