import { Routes } from '../interfaces/routes.interface';
import { ServiceController } from '../controllers/service.controller';
export declare class ServiceRoute implements Routes {
    path: string;
    router: import("express-serve-static-core").Router;
    service: ServiceController;
    constructor();
    private initializeRoutes;
}
