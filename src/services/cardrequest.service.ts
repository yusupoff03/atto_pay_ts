import { CARD_SERVICE_PASSWORD, CARD_SERVICE_URL, CARD_SERVICE_USERNAME } from '@config';
import axios from 'axios';
import { CustomError } from '@exceptions/CustomError';
import crypto from 'crypto';
import base64url from 'base64url';

export class CardRequestService {
  public static async cardNewOtp(pan, expiry, phone) {
    const params = {
      card: {
        pan: `${pan}`,
        expiry: `${expiry}`,
        requestorPhone: `${phone}`,
      },
    };
    const response = await this.cardRequest(params, 'cards.new.otp');
    const error = response.data.error;
    if (error) {
      switch (error.code) {
        case -200:
          throw new CustomError('CARD_NOT_FOUND');
          break;
        case -261:
          throw new CustomError('CARD_BLOCKED');
          break;
        case -270:
        case -314:
        case -317:
          throw new CustomError('EXPIRED_OTP');
          break;
        case -269:
          throw new CustomError('WRONG_OTP');
          break;
        case -320:
          throw new CustomError('CARD_BELONGS_TO_ANOTHER');
          break;
        default:
          throw new CustomError('SVGATE_ERROR');
          break;
      }
    }
    return response;
  }
  public static async CardVerify(id, code) {
    const params = {
      otp: {
        id: id,
        code: code,
      },
    };
    return await this.cardRequest(params, 'cards.new.verify');
  }
  public static async cardPayment(cardToken, amount) {
    const params = {
      tran: {
        purpose: 'payment',
        cardId: cardToken,
        amount: amount * 100, // convert to tiyn
        ext: `SVGATE_${base64url(crypto.randomBytes(32))}`,
        merchantId: '90126913',
        terminalId: '91500009',
      },
    };
    const response = await this.cardRequest(params, 'trans.pay.purpose');
    const error = response.data.error;
    if (error) {
      switch (error.code) {
        case -200:
          throw new CustomError('CARD_NOT_FOUND');
          break;
        case -261:
          throw new CustomError('CARD_BLOCKED');
          break;
        case -270:
        case -314:
        case -317:
          throw new CustomError('EXPIRED_OTP');
          break;
        case -269:
          throw new CustomError('WRONG_OTP');
          break;
        case -320:
          throw new CustomError('CARD_BELONGS_TO_ANOTHER');
          break;
        default:
          throw new CustomError('SVGATE_ERROR');
          break;
      }
    }
    return response;
  }
  private static async cardRequest(params: object, method: string) {
    const url = `${CARD_SERVICE_URL}`;
    const username = `${CARD_SERVICE_USERNAME}`;
    const password = `${CARD_SERVICE_PASSWORD}`;
    const options = {
      method: 'POST',
      url: url,
      auth: {
        username,
        password,
      },
      data: {
        jsonrpc: '2.0',
        method: method,
        id: 'afff34abc',
        params,
      },
    };
    return axios(options);
  }
}
