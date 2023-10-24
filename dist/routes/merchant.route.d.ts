import { Routes } from '../interfaces/routes.interface';
import { MerchantController } from '../controllers/merchant.controller';
import { AuthController } from '../controllers/auth.controller';
export declare class MerchantRoute implements Routes {
    path: string;
    router: import("express-serve-static-core").Router;
    merchant: MerchantController;
    auth: AuthController;
    constructor();
    private initializeRoutes;
}
