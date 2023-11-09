import { NextFunction, Request, Response } from 'express';
import { Container } from 'typedi';
import { Merchant } from '@interfaces/merchant.interface';
import { MerchantService } from '@services/merchant.service';
import { verify } from 'jsonwebtoken';
import { SECRET_KEY } from '@config';
import { DataStoredInToken } from '@interfaces/auth.interface';
import { HttpException } from '@exceptions/httpException';
import { CustomError } from "@exceptions/CustomError";

export class MerchantController {
  public merchant = Container.get(MerchantService);
  public getMerchantProfile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const merchantId = await this.getMerchantId(req);
      const merchant: Merchant = await this.merchant.getMerchantById(merchantId);
      delete merchant.hashed_password;
      res.status(200).json(merchant);
    } catch (error) {
      next(error);
    }
  };
  public updateMerchant = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const merchantId = await this.getMerchantId(req);
      const { name } = req.body;
      const updateMerchantData = await this.merchant.updateMerchant(merchantId, name);
      res.status(200).json({
        data: updateMerchantData,
      });
    } catch (error) {
      next(error);
    }
  };
  public updateMerchantLang = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const merchantId = await this.getMerchantId(req);
      const { lang } = req.body;
      await this.merchant.updateMerchantLang(merchantId, lang);
      res.status(200).json({ success: true });
    } catch (error) {
      next(error);
    }
  };
  private getMerchantId = async (req: Request): Promise<string> => {
    const token: string = req.headers.authorization;
    const decodedToken = verify(token, SECRET_KEY) as DataStoredInToken;
    if (decodedToken.role) {
      return String(decodedToken.id);
    }
    throw new CustomError('MISSING_TOKEN');
  };
}
