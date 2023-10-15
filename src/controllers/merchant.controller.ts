import { NextFunction, Request, Response } from 'express';
import { Container } from 'typedi';
import { Merchant } from '@interfaces/merchant.interface';
import { MerchantService } from '@services/merchant.service';
import { verify } from 'jsonwebtoken';
import { SECRET_KEY } from '@config';
import { DataStoredInToken } from '@interfaces/auth.interface';
import { HttpException } from '@exceptions/httpException';

export class MerchantController {
  public merchant = Container.get(MerchantService);

  public getMerchantProfile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const merchantId = await this.getMerchantId(req);
      const merchantData: Merchant = await this.merchant.getMerchantById(merchantId);
      res.status(200).json({
        data: merchantData,
      });
    } catch (error) {
      next(error);
    }
  };
  public updateMerchant = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const merchantId = await this.getMerchantId(req);
      const { name, password } = req.body;
      const updateMerchantData = await this.merchant.updateMerchant(merchantId, name, password);
      res.status(200).json({
        data: updateMerchantData,
      });
    } catch (error) {
      next(error);
    }
  };

  private getMerchantId = async (req: Request): Promise<string> => {
    const cookie = req.cookies['Authorization'];
    const decodedToken = verify(cookie, SECRET_KEY) as DataStoredInToken;
    if (decodedToken.role) {
      return String(decodedToken.id);
    }
    throw new HttpException(403, 'You dont have access to this recourse');
  };
}
