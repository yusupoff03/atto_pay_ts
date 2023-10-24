import { NextFunction, Request, Response } from 'express';
export declare const AuthMiddleware: (req: Request, res: Response, next: NextFunction) => Promise<void>;
