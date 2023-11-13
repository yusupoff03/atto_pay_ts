import { NextFunction, Request, Response } from 'express';
import { Container } from 'typedi';
import { RequestWithCustomer } from '@interfaces/auth.interface';
import { Customer, CustomerLogin } from '@interfaces/customers.interface';
import { AuthService } from '@services/auth.service';
import { Merchant } from '@interfaces/merchant.interface';

export class AuthController {
  public auth = Container.get(AuthService);

  public signUp = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const customerData: Customer = req.body;
      const trust: boolean = req.body.trust || false;
      const uid: string = req.headers['x-device-id'] as string;
      const { token, customer } = await this.auth.signup(customerData, trust, uid);
      res.status(201).json({ token: token, data: customer, message: 'signup' });
    } catch (error) {
      next(error);
    }
  };

  public logIn = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const customerData: CustomerLogin = req.body;
      const deviceId: string = req.headers['x-device-id'] as string;
      const { tokenData, findCustomer } = await this.auth.login(customerData, deviceId);
      res.status(200).json({ token: tokenData.token, data: findCustomer, message: 'login' });
    } catch (error) {
      next(error);
    }
  };
  public getCustomerLoginType = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { phone } = req.body;
      const deviceId = req.headers['x-device-id'] as string;
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
      res.status(200).json({ data: logOutCustomerData, message: 'logout' });
    } catch (error) {
      next(error);
    }
  };
  public signUpMerchant = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const merchantData: Merchant = req.body;
      const newEmail = merchantData.email.toLowerCase();
      const { otp } = req.body;
      const { tokenData, merchant } = await this.auth.signUpMerchant(merchantData, newEmail, otp);
      res.status(201).json({ token: tokenData.token, data: merchant });
    } catch (error) {
      next(error);
    }
  };
  public sendCode = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { email, resend } = req.body;
      const newEmail = email.toLowerCase();
      const timeLeft = await this.auth.sendCode(newEmail, resend);
      console.log(timeLeft);
      res.status(200).json({ success: true, timeLeft: timeLeft });
    } catch (error) {
      next(error);
    }
  };
  public loginMerchant = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { email, password } = req.body;
      const newEmail = email.toLowerCase();
      const deviceId = req.headers['x-device-id'] as string;
      const { merchant, tokenData } = await this.auth.loginMerchant(newEmail, password, deviceId);
      res.status(200).json({ token: tokenData.token, merchant: merchant });
    } catch (error) {
      next(error);
    }
  };
}
