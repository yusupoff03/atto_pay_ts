import { hash, compare } from 'bcrypt';
import { sign } from 'jsonwebtoken';
import { Service } from 'typedi';
import { SECRET_KEY } from '@config';
import pg from '@database';
import { HttpException } from '@exceptions/httpException';
import { DataStoredInToken, TokenData } from '@interfaces/auth.interface';
import { Customer } from '@interfaces/customers.interface';
const createToken = (customer: Customer): TokenData => {
  const dataStoredInToken: DataStoredInToken = { id: customer.id };
  const expiresIn: number = 60 * 60;

  return { expiresIn, token: sign(dataStoredInToken, SECRET_KEY, { expiresIn }) };
};

const createCookie = (tokenData: TokenData): string => {
  return `Authorization=${tokenData.token}; HttpOnly; Max-Age=${tokenData.expiresIn};`;
};

@Service()
export class AuthService {
  public async signup(customerData: Customer, uid: string): Promise<Customer> {
    const { name, phone, password } = customerData;
    const { rows: findCustomer } = await pg.query(
      `
    SELECT EXISTS(
      SELECT
        "phone"
      FROM
        customer
      WHERE
        "phone" = $1
    )`,
      [phone],
    );
    if (findCustomer[0].exists) throw new HttpException(409, `This phone ${customerData.phone} already exists`);

    const hashedPassword = await hash(password, 10);
    const { rows: signUpCustomerData } = await pg.query(
      `
      INSERT INTO
        customer(
          "name",
          "phone",
          "hashed_password"
        )
      VALUES ($1, $2,$3)
      RETURNING "id",phone,hashed_password
      `,
      [name, phone, hashedPassword],
    );
    pg.query(`INSERT INTO customer_device(customer_id,device_id) values ($1,$2)`, [signUpCustomerData[0].id, uid]);
    return signUpCustomerData[0];
  }

  public async login(CustomerData: Customer): Promise<{ cookie: string; findCustomer: Customer }> {
    const { phone, password } = CustomerData;

    const { rows, rowCount } = await pg.query(
      `
          SELECT "id",
                 "phone",
                 "hashed_password"
          FROM customer
          WHERE "phone" = $1
      `,
      [phone],
    );
    if (!rowCount) throw new HttpException(409, `This phone ${phone} was not found`);

    const isPasswordMatching: boolean = await compare(password, rows[0].hashed_password);
    if (!isPasswordMatching) throw new HttpException(409, "You're password not matching");

    const tokenData = createToken(rows[0]);
    const cookie = createCookie(tokenData);
    return { cookie, findCustomer: rows[0] };
  }

  public async logout(customerData: Customer): Promise<Customer> {
    const { phone, hashed_password } = customerData;

    const { rows, rowCount } = await pg.query(
      `
    SELECT
        "phone",
        "hashed_password"
      FROM
       customer
      WHERE
        "phone" = $1
      AND
        "hashed_password" = $2
    `,
      [phone, hashed_password],
    );
    if (!rowCount) throw new HttpException(409, "Customer doesn't exist");

    return rows[0];
  }
}
