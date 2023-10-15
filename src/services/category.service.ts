import { Service } from 'typedi';
import pg from '@database';
import { HttpException } from '@exceptions/httpException';
@Service()
export class CategoryService {
  public async getAllCategories() {
    const { rows } = await pg.query(`Select * from service_category `);
    if (rows[0]) {
      return rows;
    }
    throw new HttpException(404, 'Categories not found');
  }
}
