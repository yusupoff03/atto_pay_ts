import { Service } from 'typedi';
import pg from '@database';
import { CreateCardDto, CardUpdateDto } from '@dtos/card.dto';
import { CustomError } from '@exceptions/CustomError';

@Service()
export class CardsService {
  public async createCard(cardDto: CreateCardDto, customerId: string, lang) {
    const name = cardDto.name;
    const pan = cardDto.pan;
    const owner_name = cardDto.owner_name;
    const expiry_month: string = cardDto.expiry_month;
    const expiry_year: string = cardDto.expiry_year;
    const { rows } = await pg.query(
      `Select *
from customer_card
where pan = $1`,
      [pan],
    );
    if (rows[0]) {
      throw new CustomError('CARD_ALREADY_ADDED');
    }
    const { rows: cardRows } = await pg.query(
      `INSERT INTO customer_card( customer_id,name, owner_name,pan, expiry_month, expiry_year)
       values ($1, $2, $3, $4, $5,$6) returning (select message from message where name = 'CARD_ADDED')`,
      [customerId, name, owner_name, pan, expiry_month, expiry_year],
    );
    return cardRows[0].message[lang];
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

  public async getOwnerByPan(pan: any) {
    const { rows } = await pg.query(`Select name from customer where id=(Select customer_id from customer_card  where  pan = $1)`, [pan]);
    if (!rows[0]) throw new CustomError('CARD_NOT_FOUND');
    return rows[0];
  }
}
