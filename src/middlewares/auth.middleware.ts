import { NextFunction, Request, Response } from 'express';
import { verify } from 'jsonwebtoken';
import { SECRET_KEY } from '@config';
import { DataStoredInToken } from '@interfaces/auth.interface';
import { CustomError } from '@exceptions/CustomError';

const getAuthorization = req => {
  const cookie = req.headers.authorization;
  if (cookie) return cookie;
  return null;
};

export const AuthMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const Authorization = getAuthorization(req);

    if (Authorization) {
      const { id } = (await verify(Authorization, SECRET_KEY)) as DataStoredInToken;
      if (id) {
        next();
      } else {
        next(new CustomError('MISSING_TOKEN'));
      }
    } else {
      next(new CustomError('MISSING_TOKEN'));
    }
  } catch (error) {
    next(new CustomError('MISSING_TOKEN'));
  }
};
