import { Customer, UpdateCustomerData } from '@interfaces/customers.interface';
import { LoginQr, VerifyDto } from '@dtos/customer.dto';
export declare class CustomerService {
    private redis;
    constructor();
    findCustomerById(customerId: string): Promise<Customer>;
    updateCustomer(customerId: string, customerData: UpdateCustomerData, image: any): Promise<Customer>;
    deleteCustomer(customerId: string): Promise<boolean>;
    static getDeviceInfo(req: any): Promise<string>;
    getOtp(phone: string): Promise<string>;
    addToSaved(customerId: string, serviceId: string): Promise<void>;
    deleteFromSaved(customerId: string, serviceId: any): Promise<void>;
    updateCustomerLang(customerId: string, lang: string): Promise<boolean>;
    loginWithQr(qrLogin: LoginQr, customerId: string): Promise<void>;
    getDevices(customerId: string): Promise<any>;
    deleteCustomerDevice(deviceId: any, customerId: string, lang: string): Promise<string>;
    sendCodeToPhone(verify: VerifyDto, deviceId: any, resend: any): Promise<any>;
}
