import { NextFunction, Request, Response } from 'express';
import { CardsService } from '../services/cards.service';
export declare class CardsController {
    card: CardsService;
    createCard: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getCustomerCards: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    updateCard: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    deleteCard: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getOneById: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getOwnerByPan: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    addTransportCard: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    private getCustomerId;
}
