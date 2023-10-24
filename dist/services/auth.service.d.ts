import { TokenData } from '../interfaces/auth.interface';
import { Customer, CustomerLogin } from '../interfaces/customers.interface';
import { Merchant } from '../interfaces/merchant.interface';
export declare class AuthService {
    private redis;
    constructor();
    signup(customerData: Customer, trust: boolean, uid?: string): Promise<{
        customer: Customer;
        cookie: string;
        token: string;
    }>;
    login(CustomerData: CustomerLogin, deviceId: any): Promise<{
        tokenData: TokenData;
        findCustomer: any;
    }>;
    getLoginType(phone: string, deviceId?: string): Promise<{
        password: boolean;
        otp: boolean;
    }>;
    logout(customerData: Customer): Promise<Customer>;
    signUpMerchant(merchant: Merchant): Promise<{
        tokenData: TokenData;
        cookie: string;
        merchant: any;
    }>;
    loginMerchant(merchant: Merchant): Promise<{
        cookie: string;
        tokenData: TokenData;
        merchant: any;
    }>;
}
