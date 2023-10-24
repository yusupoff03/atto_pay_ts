import { verify } from 'jsonwebtoken';
import { SECRET_KEY } from '@config';
import { DataStoredInToken } from '@interfaces/auth.interface';
import { HttpException } from '@exceptions/httpException';
import { ServiceService } from '@services/service.service';
import { Container } from 'typedi';
import { NextFunction, Request, Response } from 'express';
import { ServiceInterface, ServiceUpdate } from '@interfaces/service.interface';

export class ServiceController {
  public service = Container.get(ServiceService);

  public getMerchantServices = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const merchantId = await this.getMerchantId(req);
      const lang = req.acceptsLanguages();
      const services = await this.service.getMerchantServices(merchantId, lang);
      res.status(200).json({
        count: services.length,
        services,
      });
    } catch (error) {
      next(error);
    }
  };
  public deleteOneById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const merchantId = await this.getMerchantId(req);
      const serviceId = req.body.id;
      const lang = req.acceptsLanguages('en', 'ru', 'uz') || 'en';
      const message = await this.service.deleteOneById(merchantId, serviceId, lang);
      res.status(200).json({
        success: true,
        message,
      });
    } catch (error) {
      next(error);
    }
  };
  public createService = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const merchantId = await this.getMerchantId(req);
      const service: ServiceInterface = req.body;
      const lang = req.acceptsLanguages('en', 'ru', 'uz') || 'en';
      service.merchant_id = merchantId;
      const message = await this.service.createService(service, req.files?.image, lang);
      res.status(201).json({
        success: true,
        message,
      });
    } catch (error) {
      next(error);
    }
  };
  public getAllServices = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const lang = req.acceptsLanguages('en', 'ru', 'uz') || 'en';
      const customerId = await this.getCustomerId(req);
      const services: ServiceInterface[] = await this.service.getAllServices(lang, customerId);
      res.status(200).json({
        count: services.length,
        services,
      });
    } catch (error) {
      next(error);
    }
  };
  public getOneById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const merchantId = await this.getMerchantId(req);
      const id = req.params.id;
      const lang = req.acceptsLanguages('en', 'ru', 'uz') || 'en';
      const service: ServiceInterface = await this.service.getOneById(merchantId, id, lang);
      res.status(200).json(service);
    } catch (error) {
      next(error);
    }
  };
  public editService = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const merchantId = await this.getMerchantId(req);
      const serviceUpdate: ServiceUpdate = req.body;
      await this.service.updateService(merchantId, serviceUpdate, req.files?.image);
      res.status(200).json({
        success: true,
      });
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
    throw new HttpException(403, 'You dont have access to this recourse');
  };
  private getCustomerId = async (req: Request): Promise<string> => {
    const cookie = req.headers.authorization;
    const decodedToken = verify(cookie, SECRET_KEY) as DataStoredInToken;
    return decodedToken.id;
  };
}
