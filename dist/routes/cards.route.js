"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "CardsRoute", {
    enumerable: true,
    get: function() {
        return CardsRoute;
    }
});
const _express = require("express");
const _cardscontroller = require("../controllers/cards.controller");
const _validationmiddleware = require("../middlewares/validation.middleware");
const _carddto = require("../dtos/card.dto");
const _authmiddleware = require("../middlewares/auth.middleware");
function _define_property(obj, key, value) {
    if (key in obj) {
        Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true
        });
    } else {
        obj[key] = value;
    }
    return obj;
}
let CardsRoute = class CardsRoute {
    initializeRoutes() {
        this.router.post(`${this.path}`, (0, _validationmiddleware.ValidationMiddleware)(_carddto.CreateCardDto), this.cards.createCard);
        this.router.post(`${this.path}/owner`, _authmiddleware.AuthMiddleware, (0, _validationmiddleware.ValidationMiddleware)(_carddto.CardOwner), this.cards.getOwnerByPan);
        this.router.post(`${this.path}/transport/add`, _authmiddleware.AuthMiddleware, (0, _validationmiddleware.ValidationMiddleware)(_carddto.CreateCardDto), this.cards.addTransportCard);
        this.router.get(`${this.path}`, this.cards.getCustomerCards);
        this.router.get(`${this.path}/:id`, this.cards.getOneById);
        this.router.delete(`${this.path}`, this.cards.deleteCard);
        this.router.put(`${this.path}`, this.cards.updateCard);
    }
    constructor(){
        _define_property(this, "path", '/customer/card');
        _define_property(this, "router", (0, _express.Router)());
        _define_property(this, "cards", new _cardscontroller.CardsController());
        this.initializeRoutes();
    }
};

//# sourceMappingURL=cards.route.js.map