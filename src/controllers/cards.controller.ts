import { NextFunction, Request, Response } from 'express';
import { Container } from 'typedi';
import { CardsService } from '@services/cards.service';
import { DataStoredInToken } from '@interfaces/auth.interface';
import { verify } from 'jsonwebtoken';
import { CreateCardDto, CardUpdateDto } from '@dtos/card.dto';
import { Customer } from '@interfaces/customers.interface';
import { SECRET_KEY } from '@config';
import { Card } from '@interfaces/cards.interface';

export class CardsController {
  public card = Container.get(CardsService);
  public createCard = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const customerId = this.getCustomerId(req);
      const cardDto: CreateCardDto = req.body;
      const createCustomerData: Customer = await this.card.createCard(cardDto, String(customerId));

      res.status(201).json({ data: createCustomerData, message: 'created' });
    } catch (error) {
      next(error);
    }
  };
  public getCustomerCards = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const customer_id = this.getCustomerId(req);
      const cards: Card[] = await this.card.getCustomerCards(String(customer_id));
      res.status(201).json({ data: cards });
    } catch (error) {
      next(error);
    }
  };
  public updateCard = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const customerId = this.getCustomerId(req);
      const cardUpdateDto: CardUpdateDto = req.body;
      const card: Card = await this.card.updateCard(String(customerId), cardUpdateDto);
      res.status(201).json({ data: card });
    } catch (error) {
      next(error);
    }
  };
  public deleteCard = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const customerId = this.getCustomerId(req);
      const cardId: string = req.body;
      const deleteCard: boolean = await this.card.deleteCard(String(customerId), cardId);

      res.status(202).json({ success: deleteCard, message: 'Card deleted' });
    } catch (error) {
      next(error);
    }
  };
  private getCustomerId = async (req: Request): Promise<string> => {
    const cookie = req.cookies['Authorization'];
    const decodedToken = verify(cookie, SECRET_KEY) as DataStoredInToken;
    return String(decodedToken.id);
  };
}
