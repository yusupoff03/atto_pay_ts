import { hash } from 'bcrypt';
import { Service } from 'typedi';
import pg from '@database';
import { HttpException } from '@exceptions/httpException';
import { Customer, UpdateCustomerData } from '@interfaces/customers.interface';
import { FileUploader } from '@utils/imageStorage';
import { RedisClient } from '@/database/redis';
import { CustomError } from '@exceptions/CustomError';
import moment from 'moment';

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
    if (!rowCount) throw new CustomError('USER_NOT_FOUND');
    const { rows: cards } = await pg.query(`Select sum(balance) from customer_card where customer_id =$1`, [customerId]);
    const customer: Customer = rows[0];
    customer.balance = cards[0].sum;
    return customer;
  }
  public async updateCustomer(customerId: string, customerData: UpdateCustomerData, image: any): Promise<Customer> {
    const { rows: findCustomer } = await pg.query(
      `
                 SELECT *
                 FROM customer
                 WHERE "id" = $1`,
      [customerId],
    );
    if (!findCustomer[0]) throw new CustomError('USER_NOT_FOUND');
    const name = customerData.name;
    const deleteImage = customerData.deleteImage;
    const newName = name || findCustomer[0].name;
    const gender = customerData.gender || findCustomer[0].gender;
    const newBirthDate = customerData.birthDate
      ? moment(customerData.birthDate, 'DD/MM/YYYY').format('YYYY-MM-DDTHH:mm:ss.SSS[Z]').toString()
      : customerData.birthDate;
    const { rows: updateCustomerData } = await pg.query(
      `
        UPDATE
          customer
        SET "name" = $2,
            "gender"= $3,
            "birth_date"=$4
        WHERE "id" = $1 RETURNING *
      `,
      [customerId, newName, gender, newBirthDate],
    );
    const fileUploader = new FileUploader('eu-north-1', 'image-24');
    if (deleteImage) {
      await pg.query(`Update customer set image_url = $1 where id = $2`, [null, customerId]);
      await fileUploader.deleteFile(findCustomer[0].image_url);
    }
    if (image) {
      await fileUploader.deleteFile(findCustomer[0].image_url);
      const objectKey = `${customerId}.${image.name.split('.').pop()}`;
      const uploadPath = await fileUploader.uploadFile(image, objectKey);
      const { rows: updateCustomer } = await pg.query(`Update customer set image_url = $1 where id= $2 returning *`, [uploadPath, customerId]);
      if (updateCustomer[0]) {
        updateCustomer[0].image_url = uploadPath;
        return updateCustomer[0];
      }
    }
  }
  public async deleteCustomer(customerId: string): Promise<boolean> {
    try {
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
  public async addToSaved(customerId: string, serviceId: string): Promise<void> {
    await pg.query(
      `
insert into customer_saved_service(customer_id, service_id)
values($1, $2)
on conflict do nothing`,
      [customerId, serviceId],
    );
  }
  public async deleteFromSaved(customerId: string, serviceId: any): Promise<void> {
    const { rows } = await pg.query(`Select * from customer_saved_service where service_id =$1 and customer_id = $2`, [serviceId, customerId]);
    if (!rows[0]) {
      throw new CustomError('SERVICE_NOT_FOUND');
    }
    await pg.query(`delete from customer_saved_service where customer_id  =$1 and service_id =$2`, [customerId, serviceId]);
  }
  async updateCustomerLang(customerId: string, lang: string): Promise<boolean> {
    const { rows } = await pg.query(`Select * from customer where id = $1`, [customerId]);
    if (!rows[0]) throw new CustomError('USER_NOT_FOUND');

    await pg.query(`Update customer set lang = $1 where id = $2`, [lang, customerId]);
    return true;
  }
}
