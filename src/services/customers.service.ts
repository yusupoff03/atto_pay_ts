import { hash } from 'bcrypt';
import { Service } from 'typedi';
import pg from '@database';
import { HttpException } from '@exceptions/httpException';
import { Customer, UpdateCustomerData } from '@interfaces/customers.interface';
import { FileUploader } from '@utils/imageStorage';
import { RedisClient } from '@/database/redis';

@Service()
export class CustomerService {
  private redis: RedisClient;
  constructor() {
    this.redis = new RedisClient();
  }
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

  public async updateCustomer(customerId: string, customerData: UpdateCustomerData, image: any): Promise<Customer> {
    const { rows: findCustomer } = await pg.query(
      `
                 SELECT *
                 FROM customer
                 WHERE "id" = $1`,
      [customerId],
    );
    if (!findCustomer[0]) throw new HttpException(409, "Customer doesn't exist");
    const name = customerData.name;
    console.log(findCustomer[0]);
    const password = customerData.password;
    const deleteImage = customerData.deleteImage;
    const hashedPassword = await hash(password, 10);
    const newName = name || findCustomer[0].name;
    const newPassword = hashedPassword || findCustomer[0].hashed_password;
    const { rows: updateCustomerData } = await pg.query(
      `
        UPDATE
          customer
        SET "name"    = $2,
            "hashed_password" = $3
        WHERE "id" = $1 RETURNING *
      `,
      [customerId, newName, newPassword],
    );
    const fileUploader = new FileUploader('eu-north-1', 'image-24');
    if (deleteImage) {
      await pg.query(`Update customer set photo_url = $1 where id = $2`, [null, customerId]);
      await fileUploader.deleteFile(findCustomer[0].photo_url);
    }
    if (image) {
      await fileUploader.deleteFile(findCustomer[0].photo_url);
      const objectKey = `${customerId}.${image.name.split('.').pop()}`;
      const uploadPath = await fileUploader.uploadFile(image, objectKey);
      console.log(uploadPath);
      const { rows: updateCustomer } = await pg.query(`Update customer set photo_url = $1 where id= $2 returning *`, [uploadPath, customerId]);
      if (updateCustomer[0].exists) {
        return updateCustomer[0];
      }
    }
  }
  public async deleteCustomer(customerId: string): Promise<boolean> {
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
      await pg.query(`delete from customer_device where customer_id=$1`, [customerId]);
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

  public async getOtp(phone: string): Promise<string> {
    await this.redis.hGet('otp', phone, (err, otp) => {
      if (err) throw new HttpException(403, err.message);

      return JSON.parse(otp).code.toString();
    });
    throw new HttpException(404, 'Not found');
  }
}
