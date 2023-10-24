import { CreateCardDto, CardUpdateDto } from '../dtos/card.dto';
export declare class CardsService {
    createCard(cardDto: CreateCardDto, customerId: string, lang: any): Promise<any>;
    getCustomerCards(customerId: string): Promise<any[]>;
    updateCard(customerId: string, cardDto: CardUpdateDto): Promise<any>;
    deleteCard(customerId: string, cardId: string): Promise<boolean>;
    getOneById(customerId: string, cardId: string): Promise<any>;
    getOwnerByPan(pan: any): Promise<any>;
}
