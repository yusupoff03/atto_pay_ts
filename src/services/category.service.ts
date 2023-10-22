import { Service } from 'typedi';
import pg from '@database';
import { HttpException } from '@exceptions/httpException';
import { Category } from '@interfaces/category.interface';
@Service()
export class CategoryService {
  public async getAllCategories(lang: string): Promise<Category[]> {
    const { rows } = await pg.query('select id, code, name -> $1 as name from service_category', [lang]);
    if (rows[0]) {
      return rows;
    }
    return [];
  }
}
