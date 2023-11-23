import { NextFunction, Request, Response } from 'express';
import { MerchantService } from '@services/merchant.service';
export declare class MerchantController {
    merchant: MerchantService;
    getMerchantProfile: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    updateMerchant: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    updateMerchantLang: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    private getMerchantId;
}
