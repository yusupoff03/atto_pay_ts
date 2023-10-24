import { ServiceService } from '../services/service.service';
import { NextFunction, Request, Response } from 'express';
export declare class ServiceController {
    service: ServiceService;
    getMerchantServices: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    deleteOneById: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    createService: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getAllServices: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getOneById: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    editService: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    private getMerchantId;
    private getCustomerId;
}
