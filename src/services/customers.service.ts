import { hash } from 'bcrypt';
import { Service } from 'typedi';
import pg from '@database';
import { HttpException } from '@exceptions/httpException';
import { Customer } from '@interfaces/customers.interface';

@Service()
export class CustomerService {
  public async findAllCustomer(): Promise<Customer[]> {
    const { rows } = await pg.query(`
      SELECT *
      FROM customer
    `);
    return rows;
  }

  public async findCustomerById(customerId: string): Promise<Customer> {
    const { rows, rowCount } = await pg.query(
      `
        SELECT *
        FROM customer
        WHERE id = $1
      `,
      [customerId],
    );
    if (!rowCount) throw new HttpException(409, "Customer doesn't exist");

    return rows[0];
  }

  public async createCustomer(customerData: Customer): Promise<Customer> {
    const { phone, password } = customerData;

    const { rows } = await pg.query(
      `
        SELECT EXISTS(
                 SELECT "phone"
                 FROM customer
                 WHERE "phone" = $1
                 )`,
      [phone],
    );
    if (rows[0].exists) throw new HttpException(409, `This phone ${phone} already exists`);

    const hashedPassword = await hash(password, 10);
    const { rows: createCustomerData } = await pg.query(
      `
        INSERT INTO customer("phone",
                             "password")
        VALUES ($1, $2) RETURNING "phone", "password"
      `,
      [phone, hashedPassword],
    );

    return createCustomerData[0];
  }

  public async updateCustomer(customerId: number, customerData: Customer): Promise<Customer[]> {
    const { rows: findCustomer } = await pg.query(
      `
        SELECT EXISTS(
                 SELECT "id"
                 FROM customer
                 WHERE "id" = $1
                 )`,
      [customerId],
    );
    if (findCustomer[0].exists) throw new HttpException(409, "Customer doesn't exist");

    const { phone, password } = customerData;
    const hashedPassword = await hash(password, 10);
    const { rows: updateCustomerData } = await pg.query(
      `
        UPDATE
          customer
        SET "phone"    = $2,
            "password" = $3
        WHERE "id" = $1 RETURNING "phone", "password"
      `,
      [customerId, phone, hashedPassword],
    );

    return updateCustomerData;
  }

  public async deleteCustomer(customerId: number): Promise<boolean> {
    try {
      console.log(`Deleting customer with ID: ${customerId}`);
      const { rows: findCustomer } = await pg.query(
        `
          SELECT EXISTS(
                   SELECT "id"
                   FROM customer
                   WHERE "id" = $1 ::uuid
                   )`,
        [customerId],
      );

      if (!findCustomer[0].exists) {
        throw new HttpException(409, "Customer doesn't exist");
      }

      await pg.query(
        `
          DELETE
          FROM customer
          WHERE id = $1
        `,
        [customerId],
      );

      return true;
    } catch (error) {
      console.error(`Error deleting customer:`, error);
      throw error;
    }
  }
}
