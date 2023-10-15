import { NextFunction, Request, Response } from 'express';
import { logger } from '@utils/logger';
import pg from '@database';
import { CustomError } from '@exceptions/CustomError';
import { HttpException } from '@exceptions/httpException';

export const ErrorMiddleware = async (error: HttpException | CustomError, req: Request, res: Response, next: NextFunction) => {
  const isDevenv = process.env.NODE_ENV === 'development';
  try {
    const lang = req.acceptsLanguages('en', 'ru', 'uz') || 'en';
    const { rows: errorObject } = await pg.query<{ message: string; http_code: number }>(
      `SELECT message -> $2 AS message, http_code
       FROM error
       WHERE name = $1`,
      [error.name.toUpperCase(), lang],
    );

    const status: number = errorObject[0]?.http_code || 500;
    const message: string = errorObject[0]?.message || 'Something went wrong';
    const info = error.info;
    const type = error.name;
    const details = isDevenv ? error.message : undefined;
    const stack = isDevenv ? error.stack : undefined;
    console.log(errorObject[0]);
    logger.error(`[${req.method}] ${req.path} >> StatusCode:: ${status}, Message:: ${message}`);
    res.status(status).json({ message, status, info, type, details, stack });
  } catch (err) {
    next(err);
  }
};
