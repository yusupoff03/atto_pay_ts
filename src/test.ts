const axios = require('axios');
const { Agent } = require('https');

const request = async function request(cardNumber) {
  const options = {
    method: 'GET',
    url: `https://atto.crm24.uz/v1.0/terminal/top-up/check?cardNumber=${cardNumber}`,
    headers: {
      'Content-Type': 'application/json',
      access_token: 'czxnajt3rjk38eedq0zlrais12fa92',
    },
    data: {
      login: 'faresaler',
      password: '1234567$fF',
    },
    httpsAgent: new Agent({
      rejectUnauthorized: false,
    }),
  };

  try {
    const response = await axios(options);
    console.log(response);
  } catch (error) {
    console.error(error.message);
  }
};
module.exports = {
  request,
};
