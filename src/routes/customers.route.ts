import { Router } from 'express';
import { CustomersController } from '@controllers/customers.controller';
import { CreateCustomerDto } from '@dtos/customer.dto';
import { Routes } from '@interfaces/routes.interface';
import { ValidationMiddleware } from '@middlewares/validation.middleware';

export class CustomersRoute implements Routes {
  public path = '/customers';
  public router = Router();
  public customer = new CustomersController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, this.customer.getCustomers);
    this.router.get(`${this.path}/:id`, this.customer.getCustomerById);
    this.router.post(`${this.path}`, ValidationMiddleware(CreateCustomerDto), this.customer.createCustomer);
    this.router.put(`${this.path}/:id`, ValidationMiddleware(CreateCustomerDto, true), this.customer.updateCustomer);
    this.router.delete(`${this.path}/:id`, this.customer.deleteCustomer);
  }
}
