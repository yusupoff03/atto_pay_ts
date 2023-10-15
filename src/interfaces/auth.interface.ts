import { Request } from 'express';
import { Customer } from '@interfaces/customers.interface';

export interface DataStoredInToken {
  id: string;
  role?: string;
}

export interface TokenData {
  token: string;
  expiresIn: number;
}

export interface RequestWithCustomer extends Request {
  customer: Customer;
}
