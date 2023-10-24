import { NextFunction, Request, Response } from 'express';
import { CustomerService } from '../services/customers.service';
export declare class CustomersController {
    customer: CustomerService;
    getCustomers: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getCustomerById: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    addServiceToSaved: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    deleteServiceFromSaved: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    updateCustomer: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    updateCustomerLang: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    deleteCustomer: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getOtp: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    private getCustomerId;
}
