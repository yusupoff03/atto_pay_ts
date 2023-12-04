import { Service } from 'typedi';
import pg from '@database';
import { CreateCardDto, CardUpdateDto, CardForOtp } from '@dtos/card.dto';
import { CustomError } from '@exceptions/CustomError';
import { requestCardBalance } from '@/services/test';
import { CardRequestService } from '@services/cardrequest.service';
import RedisClient from '@/database/redis';

@Service()
export class CardsService {
  private redis: RedisClient;
  constructor() {
    this.redis = new RedisClient();
  }
  public async createCard(cardDto: CreateCardDto, customerId: string, lang, deviceId: string) {
    const { rows } = await pg.query(
      `Select *
from customer_card
where pan = $1`,
      [cardDto.pan],
    );
    if (rows[0]) {
      throw new CustomError('CARD_ALREADY_ADDED');
    }
    const id = await this.redis.hGet('card_otp_id', deviceId);
    console.log(id);
    if (!id) {
      throw new CustomError('WRONG_OTP');
    }
    const response = await CardRequestService.CardVerify(id, cardDto.code);
    if (response.data.error) throw new CustomError('WRONG_OTP');
    const name = cardDto.name;
    const pan = response.data.result.pan;
    const owner_name = cardDto.owner_name;
    const expiry_month: string = cardDto.expiry_month;
    const expiry_year: string = cardDto.expiry_year;
    const balance: number = response.data.result.balance / 100;
    const card_id = response.data.result.id;
    const { rows: cardRows } = await pg.query(
      `INSERT INTO customer_card( customer_id,name, owner_name,pan, expiry_month, expiry_year, balance, verified_id)
       values ($1, $2, $3, $4, $5,$6,$7,$8) returning (select message from message where name = 'CARD_ADDED')`,
      [customerId, name, owner_name, pan, expiry_month, expiry_year, balance, card_id],
    );
    return cardRows[0].message[lang];
  }
  public async newOtp(cardForOtp: CardForOtp, customer_id: string, deviceId: string) {
    const { rows } = await pg.query('Select * from customer_card where pan=$1', [cardForOtp.pan]);
    if (rows[0]) throw new CustomError('CARD_BELONGS_TO_ANOTHER');
    const { rows: user } = await pg.query(`Select * from customer where id = $1`, [customer_id]);
    if (!user[0]) throw new CustomError('USER_NOT_FOUND');
    const expiry = `${cardForOtp.expiry_year}${cardForOtp.expiry_month}`;
    const response = await CardRequestService.cardNewOtp(cardForOtp.pan, expiry, user[0].phone);
    console.log(response);
    if (response.data.error) throw new CustomError('CARD_NOT_FOUND');
    await this.redis.hSet('card_otp_id', deviceId, response.data.result.id);
  }
  public async getCustomerCards(customerId: string) {
    const { rows } = await pg.query(`Select *, mask_credit_card(pan) as pan from customer_card where customer_id = $1`, [customerId]);
    if (!rows[0]) {
      return [];
    }
    return rows;
  }
  public async updateCard(customerId: string, cardDto: CardUpdateDto, lang) {
    const { name, id } = cardDto;
    const { rows } = await pg.query(
      `UPDATE customer_card
                                     SET name=$1
                                     where id = $2
                                       and customer_id = $3 RETURNING (select message from message where name = 'CARD_UPDATED')`,
      [name, id, customerId],
    );
    if (!rows[0]) {
      throw new CustomError('CARD_NOT_FOUND');
    }
    return rows[0].message[lang];
  }
  public async deleteCard(customerId: string, cardId: string, lang) {
    const { rows } = await pg.query(`Select * from customer_card where id=$1 and customer_id=$2`, [cardId, customerId]);
    if (!rows[0]) {
      throw new CustomError('CARD_NOT_FOUND');
    }
    const { rows: error } = await pg.query('call delete_card($1,$2,null,null)', [cardId, customerId]);
    if (error[0].error_code) {
      throw new CustomError(error[0].error_code, error[0].error_message);
    }
    const { rows: message } = await pg.query(`Select message from message where name = 'CARD_DELETED'`);
    return message[0].message[lang];
  }
  public async getOneById(customerId: string, cardId: string) {
    const { rows } = await pg.query(`Select * from customer_card where id= $1  and customer_id = $2`, [cardId, customerId]);
    if (!rows[0]) throw new CustomError('CARD_NOT_FOUND');

    return rows[0];
  }
  public async addTransportCard(card: CreateCardDto, customerId: string, lang): Promise<string> {
    const pan = card.pan;
    const expiry_month: string = card.expiry_month;
    const expiry_year: string = card.expiry_year;
    const { rows } = await pg.query(
      `Select *
from customer_card
where pan = $1`,
      [pan],
    );
    if (rows[0]) {
      throw new CustomError('CARD_ALREADY_ADDED');
    }
    const response = await requestCardBalance(pan);
    const { rows: cardRows } = await pg.query(
      `INSERT INTO customer_transport_card( customer_id,pan, expiry_month, expiry_year,balance)
       values ($1, $2, $3, $4,$5) returning (select message from message where name = 'CARD_ADDED')`,
      [customerId, pan, expiry_month, expiry_year, response.data.data.balance],
    );
    return cardRows[0].message[lang];
  }
  public async getOwnerByPan(pan: any) {
    const { rows } = await pg.query(`Select name from customer where id=(Select customer_id from customer_card  where  pan = $1)`, [pan]);
    if (!rows[0]) throw new CustomError('CARD_NOT_FOUND');
    return rows[0];
  }
}
