import { NextFunction, Request, Response } from 'express';
import { CustomError } from '@exceptions/CustomError';
import { HttpException } from '@exceptions/httpException';
export declare const ErrorMiddleware: (error: HttpException | CustomError, req?: Request, res?: Response, next?: NextFunction) => Promise<void>;
export declare const errorHandler: (socket: any, handler: any) => (args: any[]) => void;
