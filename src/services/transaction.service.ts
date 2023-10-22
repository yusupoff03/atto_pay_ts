import { Service } from 'typedi';
import pg from 'database';
import { CustomError } from '@exceptions/CustomError';
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
}
