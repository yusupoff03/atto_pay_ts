import crypto from 'crypto';
import base64url from 'base64url';
import moment from 'moment';
import { RedisClient } from '../database/redis';
import { Validator } from 'livr';
import { CustomError } from '@exceptions/CustomError';
export async function qrLoginRequest(socket) {
  const redis = new RedisClient();
  const deviceId = socket.handshake.headers.deviceid;

  const validator = new Validator({
    deviceId: ['required', 'string'],
  });

  const validData = validator.validate({ deviceId });
  if (!validData) throw new CustomError(validator.getErrors());

  const key = base64url(crypto.randomBytes(32));
  const body = {
    key,
    expiresAt: moment().add(2, 'minutes').toISOString(),
    socketId: socket.id,
  };

  await redis.hSet('qr_login', deviceId, JSON.stringify(body));

  socket.emit('qr_login_response', { key, deviceId });
}
