import { Service } from 'typedi';
import pg from 'database';
import { CustomError } from '@exceptions/CustomError';
import { FileUploader } from '@utils/imageStorage';
import moment from 'moment';
@Service()
export class TransactionService {
  public async payForService(customerId: string, serviceId, cardId): Promise<any> {
    const { rows } = await pg.query(`call pay_for_service($1, $2, $3, null, null, null)`, [customerId, cardId, serviceId]);
    const { error_code, error_message, payment_id } = rows[0];
    if (error_code) throw new CustomError(error_code, error_message);
    return payment_id;
  }
  public async transferMoneyToSelf(customerId, fromCardId, toCardId, amount): Promise<any> {
    const { rows } = await pg.query(`call transfer_money_to_self($1,$2,$3,$4,null,null,null)`, [customerId, fromCardId, toCardId, amount]);
    const { error_code, error_message, transfer_id } = rows[0];
    if (error_code) {
      throw new CustomError(error_code, error_message);
    }
    return transfer_id;
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
from get_transactions($1, $2, $3, $4, $5)
order by created_at desc, (type = 'income') desc;`,
      [customerId, fromDate, toDate, byCardId, byServiceId],
    );
    // eslint-disable-next-line prefer-const
    transactions = rows;
    transactions.forEach(t => {
      if (t.sender.image_url) t.sender.image_url = FileUploader.getUrl(t.sender.image_url);
      if (t.receiver.image_url) t.receiver.image_url = FileUploader.getUrl(t.receiver.image_url);
    });
    return transactions;
  }
}
