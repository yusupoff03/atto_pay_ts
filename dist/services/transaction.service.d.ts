export declare class TransactionService {
    function: any;
    payForService(customerId: any, serviceId: any, cardId: any, amount: any, fields: any): Promise<{
        success_message: any;
        id: any;
    }>;
    transferMoneyToSelf(customerId: any, fromCardId: any, toCardId: any, amount: any): Promise<any>;
    getTransactions(customerId: string, offset: any, fromDate: any, toDate: any, byCardId: any, byServiceId: any, page: any, limit: any): Promise<any>;
    transferMoney(customerId: any, fromCardId: any, toCardPan: any, amount: any, lang: any): Promise<any>;
}
