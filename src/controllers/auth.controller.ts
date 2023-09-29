import { NextFunction, Request, Response } from 'express';
import { Container } from 'typedi';
import { RequestWithCustomer } from '@interfaces/auth.interface';
import { Customer } from '@interfaces/customers.interface';
import { AuthService } from '@services/auth.service';

export class AuthController {
  public auth = Container.get(AuthService);

  public signUp = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userData: Customer = req.body;
      const signUpCustomerData: Customer = await this.auth.signup(userData);

      res.status(201).json({ data: signUpCustomerData, message: 'signup' });
    } catch (error) {
      next(error);
    }
  };

  public logIn = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userData: Customer = req.body;
      const { cookie, findCustomer } = await this.auth.login(userData);

      res.setHeader('Set-Cookie', [cookie]);
      res.status(200).json({ data: findCustomer, message: 'login' });
    } catch (error) {
      next(error);
    }
  };

  public logOut = async (req: RequestWithCustomer, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userData: Customer = req.customer;
      const logOutCustomerData: Customer = await this.auth.logout(userData);

      res.setHeader('Set-Cookie', ['Authorization=; Max-age=0']);
      res.status(200).json({ data: logOutCustomerData, message: 'logout' });
    } catch (error) {
      next(error);
    }
  };
}
