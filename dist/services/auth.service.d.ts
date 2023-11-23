import { TokenData } from '@interfaces/auth.interface';
import { Customer, CustomerLogin } from '@interfaces/customers.interface';
import { Merchant } from '@interfaces/merchant.interface';
export declare const createToken: (customer: Customer) => TokenData;
export declare class AuthService {
    private redis;
    constructor();
    signup(customerData: Customer, info: string, trust: boolean, deviceId: any, uid?: string): Promise<{
        customer: Customer;
        token: string;
    }>;
    login(CustomerData: CustomerLogin, deviceId: any, deviceInfo: string): Promise<{
        tokenData: TokenData;
        findCustomer: any;
    }>;
    getLoginType(phone: string, deviceId: string): Promise<{
        password: boolean;
        otp: boolean;
        timeLeft?: undefined;
    } | {
        password: boolean;
        otp: boolean;
        timeLeft: number;
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
