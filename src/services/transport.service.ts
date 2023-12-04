import { Service } from 'typedi';
import RedisClient from '@/database/redis';
import moment from 'moment';
import { getStations, topUpAttoCard } from '@services/test';
import { TopUpCardDto } from '@dtos/transport.card.dto';
import { CustomError } from '@exceptions/CustomError';
import pg from '@database';
import { CardRequestService } from '@services/cardrequest.service';
import crypto from 'crypto';
import base64url from 'base64url';
@Service()
export class TransportService {
  private redis: RedisClient;
  constructor() {
    this.redis = new RedisClient();
  }
  public async getStations(): Promise<any> {
    let stations = null;
    const stationsFromRedis = await this.redis.hGetAll('metro-stations');
    let stationsJson = null;
    if (stationsFromRedis) {
      stationsJson = JSON.parse(stationsFromRedis);
    }
    if (!stationsFromRedis || moment().isAfter(stationsJson.expires)) {
      const response = await getStations();
      stations = response.data.data.items;
      await this.redis.hSet('metro-stations', JSON.stringify(stations), JSON.stringify({ expires: moment().add(1, 'hours').valueOf() }));
      return stations;
    }
    stations = stationsJson;
    return stations;
  }
  public async topUp(topUp: TopUpCardDto, customerId: string, lang) {
    if (topUp.fromCardId === topUp.toCardId) throw new CustomError('INVALID_REQUEST');
    const { rows } = await pg.query(`select *, 'atto' as type from customer_transport_card where id = $1 and customer_id = $2`, [
      topUp.toCardId,
      customerId,
    ]);
    if (!rows[0]) throw new CustomError('CARD_NOT_FOUND');
    const { rows: cards } = await pg.query(
      `select *, mask_credit_card(pan) as pan, 'uzcard' as type from customer_card where id = $1 and customer_id = $2`,
      [topUp.fromCardId, customerId],
    );
    if (!cards[0]) throw new CustomError('CARD_NOT_FOUND');
    const response = await CardRequestService.cardPayment(cards[0].verification_id, topUp.amount);
    const id = `ATTOPAY_${base64url(crypto.randomBytes(32))}`;
    const result = await topUpAttoCard(rows[0].pan, cards[0].pan, topUp.amount, id, response.data.refNum);
    const { rows: payment } = await pg.query(`call create_atto_card_topup_transaction($1, $2, $3, $4, $5, $6, null, null, null, null)`, [
      customerId,
      topUp.fromCardId,
      response.data.ext,
      topUp.toCardId,
      result.intOrderNumber,
      topUp.amount,
    ]);
    const { error_code, error_message, transfer_id, success_message } = payment[0];

    if (error_code) throw new CustomError(error_code, error_message);

    const message = success_message[lang];
    return { transfer_id, message };
  }
}
