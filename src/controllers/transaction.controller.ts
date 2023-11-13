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
      const { serviceId, fromCardId, amount, fields } = req.body;
      const customerId = await this.getCustomerId(req);
      const lang = req.acceptsLanguages('en', 'ru', 'uz') || 'en';
      const { success_message, id } = await this.transaction.payForService(customerId, serviceId, fromCardId, amount, fields);
      const message = success_message[lang];
      console.log(success_message);
      res.status(200).json({
        success: true,
        id,
        message,
      });
    } catch (error) {
      next(error);
    }
  };
  public transferToSelf = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const customerId = await this.getCustomerId(req);
      const { fromCardId, toCardId, amount } = req.body;
      const lang = req.acceptsLanguages('en', 'ru', 'uz') || 'en';
      const { success_message, transferId } = await this.transaction.transferMoneyToSelf(customerId, fromCardId, toCardId, amount);
      const message = success_message[lang];
      res.status(200).json({
        success: true,
        transferId,
        message,
      });
    } catch (error) {
      next(error);
    }
  };
  public transferMoney = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const customerId = await this.getCustomerId(req);
      const { toCardPan, fromCardId, amount } = req.body;
      const lang = req.acceptsLanguages('en', 'ru', 'uz') || 'en';
      const { transfer_id, message } = await this.transaction.transferMoney(customerId, fromCardId, toCardPan, amount, lang);
      res.status(200).json({ success: true, transfer_id, message });
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
