import { Merchant } from '@interfaces/merchant.interface';
export declare class MerchantService {
    private redis;
    constructor();
    getMerchantById(merchantId: string): Promise<Merchant>;
    updateMerchant(merchantId: string, name: string): Promise<Merchant>;
    updateMerchantLang(merchantId: string, lang: any): Promise<void>;
    deleteMerchant(merchantId: string): Promise<void>;
}
