import { NextFunction, Request, Response } from 'express';
import { Container } from 'typedi';
import { CurrencyService } from '@services/currency,service';
import { CurrencyUpdateDto, CurrencyCreateDto } from '@dtos/currency.dto';
import { CurrencyInterface } from '@interfaces/currency.interface';
export class CurrencyController {
  public currency = Container.get(CurrencyService);
  public getCurrency = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.body;
      const currency: CurrencyInterface = await this.currency.getCurrencyById(id);
      res.status(200).json({
        data: currency[0],
      });
    } catch (error) {
      next(error);
    }
  };
  public createCurrency = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const currencyDto: CurrencyCreateDto = req.body;
      const currency: CurrencyInterface = await this.currency.createCurrency(currencyDto);

      res.status(201).json({
        data: currency,
      });
    } catch (error) {
      next(error);
    }
  };
  public updateCurrency = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const currencyUpdateDto: CurrencyUpdateDto = req.body;
      const currency: CurrencyInterface = await this.currency.updateCurrency(currencyUpdateDto);

      res.status(201).json({
        data: currency,
      });
    } catch (error) {
      next(error);
    }
  };
  public deleteCurrency = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.body;
      await this.currency.deleteCurrency(id);

      res.status(202).json({
        message: 'Deleted',
      });
    } catch (error) {
      next(error);
    }
  };
}
