import { Routes } from '@interfaces/routes.interface';
import { CardsController } from '@controllers/cards.controller';
export declare class CardsRoute implements Routes {
    path: string;
    router: import("express-serve-static-core").Router;
    cards: CardsController;
    constructor();
    private initializeRoutes;
}
