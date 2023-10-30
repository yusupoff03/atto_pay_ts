"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CardsController = void 0;
const typedi_1 = require("typedi");
const cards_service_1 = require("../services/cards.service");
const jsonwebtoken_1 = require("jsonwebtoken");
const _config_1 = require("../config");
class CardsController {
    constructor() {
        this.card = typedi_1.Container.get(cards_service_1.CardsService);
        this.createCard = async (req, res, next) => {
            try {
                const customerId = this.getCustomerId(req);
                const cardDto = req.body;
                const lang = req.acceptsLanguages('en', 'ru', 'uz') || 'en';
                const message = await this.card.createCard(cardDto, customerId, lang);
                res.status(201).json({
                    success: true,
                    message,
                });
            }
            catch (error) {
                next(error);
            }
        };
        this.getCustomerCards = async (req, res, next) => {
            try {
                const customer_id = this.getCustomerId(req);
                const cards = await this.card.getCustomerCards(String(customer_id));
                res.status(201).json({ cards, count: cards.length });
            }
            catch (error) {
                next(error);
            }
        };
        this.updateCard = async (req, res, next) => {
            try {
                const customerId = this.getCustomerId(req);
                const cardUpdateDto = req.body;
                const lang = req.acceptsLanguages('en', 'ru', 'uz') || 'en';
                const message = await this.card.updateCard(String(customerId), cardUpdateDto, lang);
                res.status(201).json({ success: true, message });
            }
            catch (error) {
                next(error);
            }
        };
        this.deleteCard = async (req, res, next) => {
            try {
                const customerId = this.getCustomerId(req);
                const { id } = req.body;
                const lang = req.acceptsLanguages('en', 'ru', 'uz') || 'en';
                const message = await this.card.deleteCard(String(customerId), id, lang);
                res.status(202).json({ success: true, message });
            }
            catch (error) {
                next(error);
            }
        };
        this.getOneById = async (req, res, next) => {
            try {
                const customerId = this.getCustomerId(req);
                const { id } = req.params;
                const card = await this.card.getOneById(customerId, id);
                res.status(200).json(card);
            }
            catch (error) {
                next(error);
            }
        };
        this.getOwnerByPan = async (req, res, next) => {
            try {
                const { pan } = req.body;
                const owner = await this.card.getOwnerByPan(pan);
                res.status(200).json({ owner });
            }
            catch (error) {
                next(error);
            }
        };
        this.getCustomerId = (req) => {
            const cookie = req.headers.authorization;
            const decodedToken = (0, jsonwebtoken_1.verify)(cookie, _config_1.SECRET_KEY);
            return String(decodedToken.id);
        };
    }
}
exports.CardsController = CardsController;
//# sourceMappingURL=cards.controller.js.map