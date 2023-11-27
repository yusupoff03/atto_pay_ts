import { CARD_SERVICE_PASSWORD, CARD_SERVICE_URL, CARD_SERVICE_USERNAME } from '@config';
import axios from 'axios';

export class CardRequestService {
  public static async cardNewOtp(pan, expiry) {
    const params = {
      card: {
        pan: `${pan}`,
        expiry: `${expiry}`,
      },
    };
    return await this.cardRequest(params, 'cards.new.otp');
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
