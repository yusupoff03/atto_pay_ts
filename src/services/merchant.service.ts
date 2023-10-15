import { hash } from 'bcrypt';
import { Service } from 'typedi';
import pg from '@database';
import { HttpException } from '@exceptions/httpException';
import { Merchant } from '@interfaces/merchant.interface';
@Service()
export class MerchantService {
  public async getMerchantById(merchantId: string): Promise<Merchant> {
    const { rows, rowCount } = await pg.query(`Select * from merchant where id=$1`, [merchantId]);
    if (!rowCount) {
      throw new HttpException(404, 'Merchant not found');
    }
    return rows[0];
  }
  public async updateMerchant(merchantId: string, name: string, password: string): Promise<Merchant> {
    const { rows: findMerchant } = await pg.query(
      `
                 SELECT *
                 FROM merchant
                 WHERE "id" = $1
                 )`,
      [merchantId],
    );
    if (findMerchant[0].exists) throw new HttpException(409, "Merchant doesn't exist");
    const hashedPassword = await hash(password, 10);
    const newName = name || findMerchant[0].name;
    const newHashedPassword = hashedPassword || findMerchant[0].hashed_password;
    const { rows: updateMerchantData } = await pg.query(
      `
        UPDATE
          merchant
        SET "email"    = $2,
            "hashed_password" = $3
        WHERE "id" = $1 RETURNING "phone", "hashed_password"
      `,
      [merchantId, newName, newHashedPassword],
    );

    return updateMerchantData[0];
  }
  public async deleteMerchant(merchantId: string): Promise<void> {
    const { rows, rowCount } = await pg.query(`Select * from merchant where id=$1`, [merchantId]);
    if (!rowCount) {
      throw new HttpException(404, 'Merchant not found');
    }
    await pg.query(`delete from merchant where id=$1`, [merchantId]);
  }
}
