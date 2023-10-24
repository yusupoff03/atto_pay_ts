export declare class TransactionService {
    payForService(customerId: string, serviceId: any, cardId: any): Promise<any>;
    transferMoneyToSelf(customerId: any, fromCardId: any, toCardId: any, amount: any): Promise<any>;
    getTransactions(customerId: string, offset: any, fromDate: any, toDate: any, byCardId: any, byServiceId: any): Promise<any>;
}
