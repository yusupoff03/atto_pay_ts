import axios from 'axios';
import { CustomError } from '@exceptions/CustomError';
import { CRM_API_URL } from '@config';

export async function request(cardNumber) {
  const url = `${CRM_API_URL}/terminal/top-up/check?cardNumber=${cardNumber}`;

  const options = {
    method: 'GET',
    url: url,
    headers: {
      'Content-Type': 'application/json',
      access_token: 'wddcvzlfsjakndi6y0obqg8xd06iau',
    },
    data: {
      login: 'faresaler',
      password: '1234567$fF',
    },
  };
  try {
    return await axios(options);
  } catch (error) {
    throw new CustomError('CARD_NOT_FOUND');
  }
}
