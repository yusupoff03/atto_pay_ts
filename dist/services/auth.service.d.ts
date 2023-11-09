import { TokenData } from '../interfaces/auth.interface';
import { Customer, CustomerLogin } from '../interfaces/customers.interface';
import { Merchant } from '../interfaces/merchant.interface';
export declare class AuthService {
    private redis;
    constructor();
    signup(customerData: Customer, trust: boolean, uid?: string): Promise<{
        customer: Customer;
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
    signUpMerchant(merchant: Merchant, email: any, code: any): Promise<{
        tokenData: TokenData;
        merchant: any;
    }>;
    sendCode(email: any, resend: any): Promise<any>;
    loginMerchant(email: any, password: any, deviceId: any): Promise<{
        tokenData: TokenData;
        merchant: any;
    }>;
}
