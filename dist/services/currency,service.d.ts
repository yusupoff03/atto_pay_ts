import { CurrencyCreateDto, CurrencyUpdateDto } from '../dtos/currency.dto';
export declare class CurrencyService {
    createCurrency(currencyDto: CurrencyCreateDto): Promise<any>;
    updateCurrency(currencyUpdateDto: CurrencyUpdateDto): Promise<any>;
    deleteCurrency(id: string): Promise<boolean>;
    getCurrencyById(id: string): Promise<any>;
}
