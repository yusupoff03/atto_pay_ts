import { Router } from 'express';
import { AuthController } from '@controllers/auth.controller';
import { CreateCustomerDto } from '@dtos/customer.dto';
import { Routes } from '@interfaces/routes.interface';
import { AuthMiddleware } from '@middlewares/auth.middleware';
import { ValidationMiddleware } from '@middlewares/validation.middleware';

export class AuthRoute implements Routes {
  public path = '/auth';
  public router = Router();
  public auth = new AuthController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    // this.router.post('/register', ValidationMiddleware(CreateCustomerDto), this.auth.signUp);
    // this.router.post('/login', ValidationMiddleware(CreateCustomerDto), this.auth.logIn);
    this.router.delete('/logout', AuthMiddleware, this.auth.logOut);
    this.router.post('/merchant/signup', this.auth.signUpMerchant);
    this.router.post('/merchant/login', this.auth.loginMerchant);
    this.router.get('/get-logintype', this.auth.getCustomerLoginType);
  }
}
