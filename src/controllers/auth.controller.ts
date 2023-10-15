import { NextFunction, Request, Response } from 'express';
import { Container } from 'typedi';
import { RequestWithCustomer } from '@interfaces/auth.interface';
import { Customer, CustomerLogin } from '@interfaces/customers.interface';
import { AuthService } from '@services/auth.service';
import { Merchant } from '@interfaces/merchant.interface';
import { HttpException } from '@exceptions/httpException';

export class AuthController {
  public auth = Container.get(AuthService);

  public signUp = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const customerData: Customer = req.body;
      const trust: boolean = req.body;
      const uid: string = req.headers['x-device-id'] as string;
      const { cookie, customer } = await this.auth.signup(customerData, uid, trust);
      res.setHeader('Set-Cookie', [cookie]);
      res.status(201).json({ data: customer, message: 'signup' });
    } catch (error) {
      next(error);
    }
  };

  public logIn = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const customerData: CustomerLogin = req.body;
      const deviceId: string = req.headers['x-device-id'] as string;
      const { cookie, findCustomer } = await this.auth.login(customerData, deviceId);

      res.setHeader('Set-Cookie', [cookie]);
      res.status(200).json({ data: findCustomer, message: 'login' });
    } catch (error) {
      next(error);
    }
  };
  public getCustomerLoginType = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { phone } = req.body;
      const deviceId = req.headers['x-device-id'] as string;
      if (!phone) {
        throw new HttpException(400, 'Phone required');
      }
      const { password, otp } = await this.auth.getLoginType(phone, deviceId);
      res.status(200).json({
        password: password,
        otp: otp,
      });
    } catch (error) {
      next(error);
    }
  };

  public logOut = async (req: RequestWithCustomer, res: Response, next: NextFunction): Promise<void> => {
    try {
      const customerData: Customer = req.customer;
      const logOutCustomerData: Customer = await this.auth.logout(customerData);
      res.setHeader('Set-Cookie', ['Authorization=; Max-age=0']);
      res.status(200).json({ data: logOutCustomerData, message: 'logout' });
    } catch (error) {
      next(error);
    }
  };
  public signUpMerchant = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const merchantData: Merchant = req.body;
      const { cookie, merchant } = await this.auth.signUpMerchant(merchantData);
      res.setHeader('Set-Cookie', [cookie]);
      res.status(201).json({
        data: merchant,
      });
    } catch (error) {
      next(error);
    }
  };
  public loginMerchant = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const merchantData: Merchant = req.body;
      const { merchant, cookie } = await this.auth.loginMerchant(merchantData);

      res.setHeader('Set-Cookie', cookie);
      res.status(200).json({
        merchant: merchant,
      });
    } catch (error) {
      next(error);
    }
  };
}
