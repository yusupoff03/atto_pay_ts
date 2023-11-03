import { NextFunction, Request, Response } from 'express';
import { RequestWithCustomer } from '../interfaces/auth.interface';
import { AuthService } from '../services/auth.service';
export declare class AuthController {
    auth: AuthService;
    signUp: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    logIn: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getCustomerLoginType: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    logOut: (req: RequestWithCustomer, res: Response, next: NextFunction) => Promise<void>;
    signUpMerchant: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    sendCode: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    loginMerchant: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}
