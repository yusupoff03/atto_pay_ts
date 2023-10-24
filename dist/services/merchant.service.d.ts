import { Merchant } from '../interfaces/merchant.interface';
export declare class MerchantService {
    getMerchantById(merchantId: string): Promise<Merchant>;
    updateMerchant(merchantId: string, name: string, password: string): Promise<Merchant>;
    updateMerchantLang(merchantId: string, lang: any): Promise<void>;
    deleteMerchant(merchantId: string): Promise<void>;
}
