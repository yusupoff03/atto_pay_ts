import { Service } from 'typedi';
import pg from '@database';
import { HttpException } from '@exceptions/httpException';
import { CreateCardDto, CardUpdateDto } from '@dtos/card.dto';

@Service()
export class CardsService {
  public async createCard(cardDto: CreateCardDto, customerId: string) {
    const { name, pan, expiry_month, expiry_year } = cardDto;
    const { rows } = await pg.query(
      `Select *
                                     from customer_card
                                     where pan = $1`,
      [pan],
    );
    if (rows[0].exists) {
      throw new HttpException(409, `This card ${pan} already exists`);
    }
    const { rows: cardRows } = await pg.query(
      `INSERT INTO customer_card(name, pan, expiry_month, expiry_year, customer_id)
       values ($1, $2, $3, $4, $5) returning name pan expiry_month,expiry_year`,
      [name, pan, expiry_month, expiry_year, customerId],
    );
    return cardRows[0];
  }

  public async getCustomerCards(customerId: string) {
    const { rows } = await pg.query(
      `Select *
                                     from customer_card
                                     where customer_id = $1`,
      [customerId],
    );
    if (!rows[0].exists) {
      throw new HttpException(404, `Card not found`);
    }
    return rows;
  }

  public async updateCard(customerId: string, cardDto: CardUpdateDto) {
    const { name, id } = cardDto;
    const { rows } = await pg.query(
      `UPDATE customer_card
                                     SET name=$1
                                     where id = $2
                                       and customer_id = $3 RETURNING name, pan, expiry_month, expiry_year`,
      [name, id, customerId],
    );
    if (!rows[0].exists) {
      throw new HttpException(404, `Card not found`);
    }
    return rows[0];
  }
  public async deleteCard(customerId: string, cardId: string) {
    const { rows } = await pg.query(`Select *from customer_card where id=$1 and customer_id=$2`, [cardId, customerId]);
    if (!rows[0].exists) {
      throw new HttpException(404, 'Card not found');
    }
    await pg.query(
      `Delete
                    from customer_card
                    where id = $1`,
      [cardId],
    );
    return true;
  }
}
