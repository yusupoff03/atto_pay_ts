import { CustomersController } from '@controllers/customers.controller';
import { Routes } from '@interfaces/routes.interface';
import { AuthController } from '@controllers/auth.controller';
export declare class CustomersRoute implements Routes {
    path: string;
    router: import("express-serve-static-core").Router;
    customer: CustomersController;
    auth: AuthController;
    constructor();
    private initializeRoutes;
}
