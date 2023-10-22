import { Router } from 'express';
import { CustomersController } from '@controllers/customers.controller';
import { CreateCustomerDto, CustomerLoginDto } from '@dtos/customer.dto';
import { Routes } from '@interfaces/routes.interface';
import { ValidationMiddleware } from '@middlewares/validation.middleware';
import { AuthController } from '@controllers/auth.controller';
import { AuthMiddleware } from '@middlewares/auth.middleware';

export class CustomersRoute implements Routes {
  public path = '/customer';
  public router = Router();
  public customer = new CustomersController();
  public auth = new AuthController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}/profile`, this.customer.getCustomerById);
    this.router.post(`${this.path}/register`, ValidationMiddleware(CreateCustomerDto), this.auth.signUp);
    this.router.post(`${this.path}/services`, AuthMiddleware, this.customer.addServiceToSaved);
    this.router.delete(`${this.path}/services`, AuthMiddleware, this.customer.deleteServiceFromSaved);
    this.router.post(`${this.path}/login`, ValidationMiddleware(CustomerLoginDto), this.auth.logIn);
    this.router.post(`${this.path}/getlogin`, this.auth.getCustomerLoginType);
    this.router.put(`${this.path}/profile`, AuthMiddleware, this.customer.updateCustomer);
    this.router.put(`${this.path}/lang`, AuthMiddleware, this.customer.updateCustomerLang);
    this.router.delete(`${this.path}/delete`, AuthMiddleware, this.customer.deleteCustomer);
    this.router.get(`${this.path}/get-otp`, this.customer.getOtp);
  }
}
