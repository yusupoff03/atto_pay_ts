import { NextFunction, Request, Response } from 'express';
import { Container } from 'typedi';
import { CardsService } from '@services/cards.service';
import { DataStoredInToken } from '@interfaces/auth.interface';
import { verify } from 'jsonwebtoken';
import { CreateCardDto, CardUpdateDto, CardForOtp } from '@dtos/card.dto';
import { SECRET_KEY } from '@config';
import { Card } from '@interfaces/cards.interface';
export class CardsController {
  public card = Container.get(CardsService);
  public createCard = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const customerId = this.getCustomerId(req);
      const cardDto: CreateCardDto = req.body;
      let message = '';
      const deviceId = req.headers['x-device-id'];
      const lang = req.acceptsLanguages('en', 'ru', 'uz') || 'en';
      if (cardDto.pan.startsWith('9987')) {
        message = await this.card.addTransportCard(cardDto, customerId, lang);
      } else {
        message = await this.card.createCard(cardDto, customerId, lang, JSON.stringify(deviceId));
      }
      res.status(201).json({
        success: true,
        message,
      });
    } catch (error) {
      next(error);
    }
  };
  public newOtp = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const customerId = this.getCustomerId(req);
      const cardForOtp: CardForOtp = req.body;
      const deviceId = req.headers['x-device-id'];
      const message = await this.card.newOtp(cardForOtp, customerId, JSON.stringify(deviceId));
      res.status(200).json({
        success: true,
        message,
      });
    } catch (error) {
      next(error);
    }
  };
  public getCustomerCards = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const customer_id = this.getCustomerId(req);
      const cards: Card[] = await this.card.getCustomerCards(String(customer_id));
      res.status(201).json({ cards, count: cards.length });
    } catch (error) {
      next(error);
    }
  };
  public updateCard = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const customerId = this.getCustomerId(req);
      const cardUpdateDto: CardUpdateDto = req.body;
      const lang = req.acceptsLanguages('en', 'ru', 'uz') || 'en';
      const message = await this.card.updateCard(String(customerId), cardUpdateDto, lang);
      res.status(201).json({ success: true, message });
    } catch (error) {
      next(error);
    }
  };
  public deleteCard = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const customerId = this.getCustomerId(req);
      const { id } = req.body;
      const lang = req.acceptsLanguages('en', 'ru', 'uz') || 'en';
      const message = await this.card.deleteCard(String(customerId), id, lang);
      res.status(202).json({ success: true, message });
    } catch (error) {
      next(error);
    }
  };
  public getOneById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const customerId = this.getCustomerId(req);
      const { id } = req.params;
      const card: Card = await this.card.getOneById(customerId, id);
      res.status(200).json(card);
    } catch (error) {
      next(error);
    }
  };
  public getOwnerByPan = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { pan } = req.body;
      const owner = await this.card.getOwnerByPan(pan);
      res.status(200).json({ owner });
    } catch (error) {
      next(error);
    }
  };
  private getCustomerId = (req: Request): string => {
    const cookie = req.headers.authorization;
    const decodedToken = verify(cookie, SECRET_KEY) as DataStoredInToken;
    return String(decodedToken.id);
  };
}
