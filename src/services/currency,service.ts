import { Service } from 'typedi';
import pg from '@database';
import { HttpException } from '@exceptions/httpException';
import { CurrencyCreateDto, CurrencyUpdateDto } from '@dtos/currency.dto';
@Service()
export class CurrencyService {
  public async createCurrency(currencyDto: CurrencyCreateDto) {
    const { name, abbreviation } = currencyDto;
    const { rows } = await pg.query(`INSERT INTO currency(name,abbreviation) values ($1,$2) RETURNING *`, [name, abbreviation]);
    if (!rows[0].exists) {
      throw new HttpException(500, 'Database error');
    }
    return rows[0];
  }
  public async updateCurrency(currencyUpdateDto: CurrencyUpdateDto) {
    const { id, name, abbreviation } = currencyUpdateDto;
    const { rows } = await pg.query(`SELECT * FROM currency where id=$1`, [id]);
    if (!rows[0].exists) {
      throw new HttpException(404, 'Currency not found');
    }
    const newName = name || rows[0].name;
    const newAbbreviation = abbreviation || rows[0].abbreviation;
    const { currency } = await pg.query(`UPDATE currency SET name=$1,abbbreviation=$2 where id=$3 RETURNING *`, [id, newName, newAbbreviation]);
    if (currency[0].exists) {
      return currency[0];
    }
    throw new HttpException(500, 'Database error');
  }
}
