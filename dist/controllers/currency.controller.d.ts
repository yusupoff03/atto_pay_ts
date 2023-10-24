import { NextFunction, Request, Response } from 'express';
import { CurrencyService } from '../services/currency,service';
export declare class CurrencyController {
    currency: CurrencyService;
    getCurrency: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    createCurrency: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    updateCurrency: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    deleteCurrency: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}
