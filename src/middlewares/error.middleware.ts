import { NextFunction, Request, Response } from 'express';
import { logger } from '@utils/logger';
import pg from '@database';
import { CustomError } from '@exceptions/CustomError';
import { HttpException } from '@exceptions/httpException';
import { Socket } from 'socket.io';

export const ErrorMiddleware = async (error: HttpException | CustomError, req?: Request, res?: Response, next?: NextFunction) => {
  console.log(error);
  try {
    const lang = req.acceptsLanguages('en', 'ru', 'uz') || 'en';
    const result = await defaultErrorHandler(error, lang);
    logger.error(`[${req.method}] ${req.path} >> StatusCode:: ${result.status}, Message:: ${result.message}`);
    res
      .status(result.status)
      .json({ message: result.message, status: result.status, info: result.info, type: result.type, details: result.details, stack: result.stack });
  } catch (err) {
    next(err);
  }
};
async function defaultErrorHandler(error, lang): Promise<{ status; type; details; stack; info; message }> {
  const isDevenv = process.env.NODE_ENV === 'development';
  const { rows: errorObject } = await pg.query<{ message: string; http_code: number }>(
    `SELECT message -> $2 AS message, http_code
       FROM message
       WHERE name = $1`,
    [error.name, lang],
  );
  const status: number = errorObject[0]?.http_code || 500;
  let message: string = errorObject[0]?.message || 'Something went wrong';
  let info = error.info;
  const type = error.name;
  const details = isDevenv ? error.message : undefined;
  const stack = isDevenv ? error.stack : undefined;

  switch (error.name) {
    case 'USER_BLOCKED': {
      if (errorObject) {
        info = { ...info, message: errorObject[0].message, timeLeft: error.info };
        message = errorObject[0].message.replace('{0}', error.info?.toString() || '60');
      }
      break;
    }
    case 'VALIDATION_ERROR': {
      info = { ...info, message: errorObject[0].message };
      message = errorObject[0].message.replace(`{0}`, error.info?.toString());
      break;
    }
  }
  return { status, type, details, stack, info, message };
}
export const errorHandler = (socket, handler): ((args: any[]) => void) => {
  const handleError = async err => {
    const lang = socket.handshake.headers.lang || 'en';
    const body = await defaultErrorHandler(err, lang);
    if (body) {
      socket.emit(body);
    }
  };
  return (...args) => {
    try {
      const ret = handler.apply(this, [socket, ...args]);
      if (ret && typeof ret.catch === 'function') {
        ret.catch(handleError);
      }
    } catch (error) {
      handleError(error);
    }
  };
};
