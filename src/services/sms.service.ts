import { CustomError } from '@exceptions/CustomError';
import axios from 'axios';
import { CRM_API_URL, SMS_SERVICE_SECRET } from '@config';

async function sendSMS(phone, msg) {
  const url = `${CRM_API_URL}/customer/send-sms`;
  const options = {
    method: 'POST',
    url: url,
    headers: {
      secret: SMS_SERVICE_SECRET,
    },
    data: {
      phone,
      msg,
    },
  };
  const axiosResponse = await axios(options);
  if (axiosResponse.data.error) {
    throw new CustomError(axiosResponse.data.error.name);
  }
  return axiosResponse;
}

export async function sendVerification(phone, code) {
  try {
    const msg = `AttoPay: this is your verification code: ${code}`;
    return await sendSMS(phone, msg);
  } catch (error) {
    throw new CustomError(error.message);
  }
}
