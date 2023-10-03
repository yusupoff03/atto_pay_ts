import { NextFunction, Request, Response } from 'express';
import { Container } from 'typedi';
import { Customer } from '@interfaces/customers.interface';
import { CustomerService } from '@services/customers.service';
import { DataStoredInToken } from '@interfaces/auth.interface';
import { SECRET_KEY } from '@config';
import { verify } from 'jsonwebtoken';

export class CustomersController {
  public customer = Container.get(CustomerService);

  public getCustomers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const findAllCustomersData: Customer[] = await this.customer.findAllCustomer();

      res.status(200).json({ data: findAllCustomersData, message: 'findAll' });
    } catch (error) {
      next(error);
    }
  };

  public getCustomerById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const customerId = String(req.params.id);
      const token = req.cookies['Authorization'];
      if (token.id === customerId) {
        const findOneCustomerData: Customer = await this.customer.findCustomerById(customerId);
        res.status(200).json({ data: findOneCustomerData, message: 'findOne' });
      } else {
        res.status(401).json({
          message: 'Unexpected token',
        });
      }
    } catch (error) {
      next(error);
    }
  };

  public createCustomer = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const customerData: Customer = req.body;
      const createCustomerData: Customer = await this.customer.createCustomer(customerData);

      res.status(201).json({ data: createCustomerData, message: 'created' });
    } catch (error) {
      next(error);
    }
  };

  public updateCustomer = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const customerId = Number(req.params.id);
      const customerData: Customer = req.body;
      const updateCustomerData: Customer[] = await this.customer.updateCustomer(customerId, customerData);

      res.status(200).json({ data: updateCustomerData, message: 'updated' });
    } catch (error) {
      next(error);
    }
  };

  public deleteCustomer = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const cookie = req.cookies['Authorization'];
      const customerId2 = req.params.id;
      const decodedToken = verify(cookie, SECRET_KEY) as DataStoredInToken;
      const customerId = decodedToken.id;
      if (customerId !== customerId2) {
        res.status(401).json({
          message: `Unexpected token`,
        });
        return;
      }
      const deleteCustomerData: boolean = await this.customer.deleteCustomer(customerId);
      res.status(200).json({ data: deleteCustomerData, message: 'deleted' });
    } catch (error) {
      next(error);
    }
  };
}
