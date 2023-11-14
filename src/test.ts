import axios from "axios";
import { CustomError } from "@exceptions/CustomError";

export async function request(cardNumber) {
  const url = `https://atto.crm24.uz/v1.0/terminal/top-up/check?cardNumber=${cardNumber}`;

  const options = {
    method: 'GET',
    url: url,
    headers: {
      'Content-Type': 'application/json',
      access_token: 'dn3aucbnmk8xa7d7yuahtkv8ze794u',
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
