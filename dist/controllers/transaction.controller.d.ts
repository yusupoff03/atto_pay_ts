import { NextFunction, Request, Response } from 'express';
import { TransactionService } from '../services/transaction.service';
export declare class TransactionController {
    transaction: TransactionService;
    pay: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    transferToSelf: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getCustomerTransactions: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    private getCustomerId;
}
