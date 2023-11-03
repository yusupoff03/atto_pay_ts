import { NextFunction, Request, Response } from 'express';
import { verify } from 'jsonwebtoken';
import { SECRET_KEY } from '@config';
import { DataStoredInToken } from '@interfaces/auth.interface';
import { Container } from 'typedi';
import { TransactionService } from '@services/transaction.service';

export class TransactionController {
  public transaction = Container.get(TransactionService);

  public pay = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { serviceId, fromCardId } = req.body;
      const customerId = await this.getCustomerId(req);
      const paymentId = await this.transaction.payForService(customerId, serviceId, fromCardId);
      res.status(200).json({
        success: true,
        paymentId,
      });
    } catch (error) {
      next(error);
    }
  };
  public transferToSelf = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const customerId = await this.getCustomerId(req);
      const { fromCardId, toCardId, amount } = req.body;
      const transferId = await this.transaction.transferMoneyToSelf(customerId, fromCardId, toCardId, amount);
      res.status(200).json({
        success: true,
        transferId,
      });
    } catch (error) {
      next(error);
    }
  };
  public getCustomerTransactions = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const customerId = await this.getCustomerId(req);
      const { offset, fromDate, toDate, byCardId = null, byServiceId = null, page, limit } = req.body;
      const transactions = await this.transaction.getTransactions(customerId, offset, fromDate, toDate, byCardId, byServiceId, page, limit);
      res.status(200).json({ length: transactions.length, transactions });
    } catch (error) {
      next(error);
    }
  };
  private getCustomerId = async (req: Request): Promise<string> => {
    const cookie = req.headers.authorization;
    const decodedToken = verify(cookie, SECRET_KEY) as DataStoredInToken;
    return decodedToken.id;
  };
}
