import { Routes } from '@interfaces/routes.interface';
export declare class TransactionRoute implements Routes {
    path: string;
    router: import("express-serve-static-core").Router;
    private transaction;
    constructor();
    initializeRoutes(): void;
}
