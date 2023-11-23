import { Router } from 'express';
import { CustomersController } from '@controllers/customers.controller';
import { CreateCustomerDto, CustomerLoginDto, LoginQr, LoginTypeDto, UpdateCustomerDto, VerifyDto } from '@dtos/customer.dto';
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
    this.router.get(`${this.path}/profile`, AuthMiddleware, this.customer.getCustomerById);
    this.router.get(`${this.path}/get-otp`, this.customer.getOtp);
    this.router.get(`${this.path}/device`, AuthMiddleware, this.customer.getDevices);
    this.router.post(`${this.path}/register`, ValidationMiddleware(CreateCustomerDto), this.auth.signUp);
    this.router.post(`${this.path}/services`, AuthMiddleware, this.customer.addServiceToSaved);
    this.router.post(`${this.path}/login`, ValidationMiddleware(CustomerLoginDto), this.auth.logIn);
    this.router.post(`${this.path}/getlogin`, ValidationMiddleware(LoginTypeDto), this.auth.getCustomerLoginType);
    this.router.post(`${this.path}/login/qr`, ValidationMiddleware(LoginQr), this.customer.loginWithQr);
    this.router.post(`${this.path}/sendcode`, ValidationMiddleware(VerifyDto), this.customer.sendCodeToPhone);
    this.router.put(`${this.path}/profile`, AuthMiddleware, ValidationMiddleware(UpdateCustomerDto), this.customer.updateCustomer);
    this.router.put(`${this.path}/lang`, AuthMiddleware, this.customer.updateCustomerLang);
    this.router.delete(`${this.path}/services`, AuthMiddleware, this.customer.deleteServiceFromSaved);
    this.router.delete(`${this.path}/delete`, AuthMiddleware, this.customer.deleteCustomer);
    this.router.delete(`${this.path}/device`, AuthMiddleware, this.customer.deleteCustomerDevice);
  }
}
