"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "CardsController", {
    enumerable: true,
    get: function() {
        return CardsController;
    }
});
const _typedi = require("typedi");
const _cardsservice = require("../services/cards.service");
const _jsonwebtoken = require("jsonwebtoken");
const _config = require("../config");
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
let CardsController = class CardsController {
    constructor(){
        _define_property(this, "card", _typedi.Container.get(_cardsservice.CardsService));
        _define_property(this, "createCard", async (req, res, next)=>{
            try {
                const customerId = this.getCustomerId(req);
                const cardDto = req.body;
                const lang = req.acceptsLanguages('en', 'ru', 'uz') || 'en';
                const message = await this.card.createCard(cardDto, customerId, lang);
                res.status(201).json({
                    success: true,
                    message
                });
            } catch (error) {
                next(error);
            }
        });
        _define_property(this, "getCustomerCards", async (req, res, next)=>{
            try {
                const customer_id = this.getCustomerId(req);
                const cards = await this.card.getCustomerCards(String(customer_id));
                res.status(201).json({
                    cards,
                    length: cards.length
                });
            } catch (error) {
                next(error);
            }
        });
        _define_property(this, "updateCard", async (req, res, next)=>{
            try {
                const customerId = this.getCustomerId(req);
                const cardUpdateDto = req.body;
                const card = await this.card.updateCard(String(customerId), cardUpdateDto);
                res.status(201).json({
                    success: true
                });
            } catch (error) {
                next(error);
            }
        });
        _define_property(this, "deleteCard", async (req, res, next)=>{
            try {
                const customerId = this.getCustomerId(req);
                const { id } = req.body;
                const deleteCard = await this.card.deleteCard(String(customerId), id);
                res.status(202).json({
                    success: deleteCard,
                    message: 'Card deleted'
                });
            } catch (error) {
                next(error);
            }
        });
        _define_property(this, "getOneById", async (req, res, next)=>{
            try {
                const customerId = this.getCustomerId(req);
                const { id } = req.params;
                const card = await this.card.getOneById(customerId, id);
                res.status(200).json(card);
            } catch (error) {
                next(error);
            }
        });
        _define_property(this, "getOwnerByPan", async (req, res, next)=>{
            try {
                const { pan } = req.body;
                const owner = await this.card.getOwnerByPan(pan);
                res.status(200).json({
                    owner
                });
            } catch (error) {
                next(error);
            }
        });
        _define_property(this, "getCustomerId", (req)=>{
            const cookie = req.headers.authorization;
            const token = cookie.replace(/"/g, '');
            const decodedToken = (0, _jsonwebtoken.verify)(token, _config.SECRET_KEY);
            return String(decodedToken.id);
        });
    }
};

//# sourceMappingURL=cards.controller.js.map