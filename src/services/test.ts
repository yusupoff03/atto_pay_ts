import axios from 'axios';
import { AGGREGATOR_NAME, AGGREGATOR_SECRET, CRM_API_URL, CRM_LOGIN, CRM_PASSWORD } from '@config';
import moment from 'moment';
import { CustomError } from '@exceptions/CustomError';

let access_token = {
  token: '',
  expires_at: 0,
};
export async function requestCardBalance(cardNumber) {
  const url = `${CRM_API_URL}/terminal/top-up/check?cardNumber=${cardNumber}`;
  const options = {
    method: 'GET',
    url: url,
    headers: {
      'Content-Type': 'application/json',
      access_token: access_token.token,
      aggregator_name: AGGREGATOR_NAME,
      secret: AGGREGATOR_SECRET,
    },
  };
  try {
    return await axios(options);
  } catch (error) {
    if (error.response.status === (405 || 401)) {
      await loginRequest();
      options.headers.access_token = access_token.token;
      return axios(options);
    }
    throw new CustomError('ERROR');
  }
}
export async function getStations() {
  const url = `${CRM_API_URL}/terminal/station/list`;
  const options = {
    method: 'GET',
    url: url,
    headers: {
      'Content-Type': 'application/json',
      access_token: access_token.token,
      aggregator_name: AGGREGATOR_NAME,
      secret: AGGREGATOR_SECRET,
    },
  };
  try {
    return await axios(options);
  } catch (error) {
    if (error.response.status === (405 || 401)) {
      await loginRequest();
      options.headers.access_token = access_token.token;
      return axios(options);
    }
    throw new CustomError('ERROR');
  }
}
export async function topUpAttoCard(cardNumber, cardMask, amount, id, refNum) {
  const url = `${CRM_API_URL}//terminal/top-up/aggregator`;
  const options = {
    method: 'POST',
    url: url,
    headers: {
      'Content-Type': 'application/json',
      access_token: access_token.token,
      aggregator_name: AGGREGATOR_NAME,
      secret: AGGREGATOR_SECRET,
    },
    data: {
      cardNumber: cardNumber,
      cardMask: cardMask,
      extOrderNumber: id,
      amount: amount,
      type: 1,
      utrnno: refNum,
    },
  };
  try {
    const response = await axios(options);
    return response.data.result;
  } catch (error) {
    if (error.response.status === (405 || 401)) {
      await loginRequest();
      options.headers.access_token = access_token.token;
      return axios(options);
    }
    throw new CustomError('ERROR');
  }
}
export async function loginRequest() {
  if (access_token.token && access_token.expires_at > moment().unix()) {
    return access_token;
  }
  const url = `${CRM_API_URL}/terminal/login`;
  const options = {
    method: 'POST',
    url: url,
    headers: {
      'Content-Type': 'application/json',
    },
    data: {
      login: CRM_LOGIN,
      password: CRM_PASSWORD,
    },
  };
  const res = await axios(options);
  access_token = {
    token: res.data.data.token,
    expires_at: res.data.data.expiresIn + moment().unix(),
  };
}
