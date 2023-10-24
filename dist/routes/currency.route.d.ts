import { Routes } from '../interfaces/routes.interface';
import { CurrencyController } from '../controllers/currency.controller';
export declare class CurrencyRoute implements Routes {
    path: '/currency';
    router: import("express-serve-static-core").Router;
    currency: CurrencyController;
    constructor();
    private initializeRoutes;
}
