import { Customer, UpdateCustomerData } from '../interfaces/customers.interface';
export declare class CustomerService {
    private redis;
    constructor();
    findAllCustomer(): Promise<Customer[]>;
    findCustomerById(customerId: string): Promise<Customer>;
    updateCustomer(customerId: string, customerData: UpdateCustomerData, image: any): Promise<Customer>;
    deleteCustomer(customerId: string): Promise<boolean>;
    getOtp(phone: string): Promise<string>;
    addToSaved(customerId: string, serviceId: string): Promise<void>;
    deleteFromSaved(customerId: string, serviceId: any): Promise<void>;
    updateCustomerLang(customerId: string, lang: string): Promise<boolean>;
}
