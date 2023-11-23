import { Request } from 'express';
import { Customer } from '@interfaces/customers.interface';
export interface DataStoredInToken {
    id: string;
    role?: string;
}
export interface TokenData {
    token: string;
    expiresIn: string;
}
export interface RequestWithCustomer extends Request {
    customer: Customer;
}
