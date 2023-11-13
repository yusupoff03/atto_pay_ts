import { Service } from 'typedi';
import pg from 'database';
import { CustomError } from '@exceptions/CustomError';
import { FileUploader } from '@utils/imageStorage';
import moment from 'moment';
import { Pool } from 'pg';
import { POSTGRES_SSL, POSTGRES_URL } from '@config';

@Service()
export class TransactionService {
  function;

  public async payForService(customerId, serviceId, cardId, amount, fields) {
    const pool = new Pool({
      connectionString: POSTGRES_URL,
      ssl: POSTGRES_SSL === 'true',
    });

    const client = await pool.connect();

    try {
      await client.query('BEGIN');

      const cardQuery = 'SELECT * FROM customer_card WHERE id = $1 AND customer_id = $2';
      const cardResult = await client.query(cardQuery, [cardId, customerId]);

      if (!cardResult.rows[0]) {
        throw new CustomError('CARD_NOT_FOUND');
      }

      const card = cardResult.rows[0];

      const serviceQuery = 'SELECT * FROM service WHERE id = $1';
      const serviceResult = await client.query(serviceQuery, [serviceId]);

      if (!serviceResult.rows[0]) {
        throw new CustomError('SERVICE_NOT_FOUND');
      }

      const service = serviceResult.rows[0];

      const merchantQuery = 'SELECT * FROM merchant WHERE id = $1';
      const merchantResult = await client.query(merchantQuery, [service.merchant_id]);
      const merchant = merchantResult.rows[0];

      if (card.balance < amount) {
        throw new CustomError('INSUFFICIENT_FUNDS');
      }

      await client.query('UPDATE customer_card SET balance = $1 WHERE id = $2', [card.balance - amount, card.id]);

      await client.query('UPDATE merchant SET balance = $1 WHERE id = $2', [parseFloat(merchant.balance) + parseInt(amount), merchant.id]);
      const paymentQuery = `
        INSERT INTO payment (owner_id, type, amount, sender_id, receiver_id, fields)
        VALUES ($1, 'expense', $2, $3, $4, $5) RETURNING id
      `;
      const paymentResult = await client.query(paymentQuery, [customerId, amount, card.id, serviceId, JSON.stringify(fields || {})]);

      const merchantPaymentQuery = `
        INSERT INTO payment (owner_id, type, amount, sender_id, receiver_id, fields)
        VALUES ($1, 'income', $2, $3, $4, $5)
      `;
      await client.query(merchantPaymentQuery, [service.merchant_id, amount, customerId, serviceId, JSON.stringify(fields || {})]);

      const messageQuery = 'SELECT message FROM message WHERE name = $1';
      const messageResult = await client.query(messageQuery, ['PAYMENT_SUCCESS']);
      const success_message = messageResult.rows[0].message;
      await client.query('COMMIT');

      return { success_message, id: paymentResult.rows[0].id };
    } catch (e) {
      await client.query('ROLLBACK');
      throw e;
    } finally {
      client.release();
    }
  }

  public async transferMoneyToSelf(customerId, fromCardId, toCardId, amount): Promise<any> {
    const { rows } = await pg.query(`call transfer_money_to_self($1,$2,$3,$4,null,null,null,null)`, [customerId, fromCardId, toCardId, amount]);
    const { error_code, error_message, transfer_id, success_message } = rows[0];
    if (error_code) {
      throw new CustomError(error_code, error_message);
    }
    return { success_message, transfer_id };
  }

  public async getTransactions(
    customerId: string,
    offset: any,
    fromDate: any,
    toDate: any,
    byCardId: any,
    byServiceId: any,
    page,
    limit,
  ): Promise<any> {
    let transactions;
    fromDate = moment(fromDate, 'DD/MM/YYYY').startOf('day').add(offset, 'hours').toISOString();
    toDate = moment(toDate, 'DD/MM/YYYY').endOf('day').add(offset, 'hours').toISOString();
    const { rows } = await pg.query(
      `select *
       from get_transactions($1, $2, $3, $4, $5, $6, $7)
       order by created_at desc, (type = 'income') desc;`,
      [customerId, fromDate, toDate, page, limit, byCardId, byServiceId],
    );
    // eslint-disable-next-line prefer-const
    transactions = rows;
    transactions.forEach(t => {
      if (t.sender.image_url) t.sender.image_url = FileUploader.getUrl(t.sender.image_url);
      if (t.receiver.image_url) t.receiver.image_url = FileUploader.getUrl(t.receiver.image_url);
    });
    return transactions;
  }

  public async transferMoney(customerId, fromCardId, toCardPan, amount, lang): Promise<any> {
    const { rows } = await pg.query(`call transfer_money($1,$2,$3,$4,null,null,null,null)`, [customerId, fromCardId, toCardPan, amount]);
    const { error_code, error_message, transfer_id, success_message } = rows[0];
    if (error_code) throw new CustomError(error_code, error_message);
    const message = success_message[lang];
    return { transfer_id, message };
  }
}
