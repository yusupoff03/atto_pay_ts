"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CardsRoute = void 0;
const express_1 = require("express");
const cards_controller_1 = require("@controllers/cards.controller");
const validation_middleware_1 = require("@middlewares/validation.middleware");
const card_dto_1 = require("@dtos/card.dto");
const auth_middleware_1 = require("@middlewares/auth.middleware");
class CardsRoute {
    constructor() {
        this.path = '/customer/card';
        this.router = (0, express_1.Router)();
        this.cards = new cards_controller_1.CardsController();
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.post(`${this.path}`, (0, validation_middleware_1.ValidationMiddleware)(card_dto_1.CreateCardDto), this.cards.createCard);
        this.router.post(`${this.path}/owner`, auth_middleware_1.AuthMiddleware, (0, validation_middleware_1.ValidationMiddleware)(card_dto_1.CardOwner), this.cards.getOwnerByPan);
        this.router.post(`${this.path}/transport/add`, auth_middleware_1.AuthMiddleware, (0, validation_middleware_1.ValidationMiddleware)(card_dto_1.CreateCardDto), this.cards.addTransportCard);
        this.router.get(`${this.path}`, this.cards.getCustomerCards);
        this.router.get(`${this.path}/:id`, this.cards.getOneById);
        this.router.delete(`${this.path}`, this.cards.deleteCard);
        this.router.put(`${this.path}`, this.cards.updateCard);
    }
}
exports.CardsRoute = CardsRoute;
//# sourceMappingURL=cards.route.js.map