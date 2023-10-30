import { Service } from 'typedi';
import pg from '@database';
import { ServiceInterface, ServiceUpdate } from '@interfaces/service.interface';
import { FileUploader } from '@utils/imageStorage';
import { CustomError } from '@exceptions/CustomError';
import base64url, { Base64Url } from 'base64url';
import * as crypto from 'crypto';

@Service()
export class ServiceService {
  private fileUploader;
  constructor() {
    this.fileUploader = new FileUploader('eu-north-1', 'image-24');
  }
  public async createService(serviceData: ServiceInterface, lang: any, image?: any): Promise<ServiceInterface> {
    const { name, price, merchant_id, categoryId, isActive } = serviceData;
    const { rows } = await pg.query(`Select * from service where merchant_id=$1 and category_id=$2 and deleted = false`, [merchant_id, categoryId]);
    console.log(rows[0]);
    if (rows[0]) throw new CustomError('SERVICE_ALREADY_EXISTS');
    const newActive = isActive || false;
    const public_key = base64url(crypto.randomBytes(16));
    const { rows: service } = await pg.query(
      `INSERT INTO service(name,price,merchant_id,category_id,is_active,public_key) values ($1,$2,$3,$4,$5,$6) RETURNING (select message from message where name = 'SERVICE_CREATED')`,
      [name, price, merchant_id, categoryId, newActive, public_key],
    );
    if (image) {
      const uploadPath = await this.fileUploader.uploadFile(image, `${service[0].id}.${image.name.split('.').pop()}`);
      if (uploadPath) await pg.query(`Update service set image_url = $1 where id = $2`, [uploadPath, service[0].id]);
    }
    if (service[0]) {
      return service[0].message[lang];
    }
    throw new CustomError('DATABASE_ERROR');
  }
  public async getMerchantServices(merchantId: string, lang: any): Promise<ServiceInterface[]> {
    const { rows } = await pg.query(
      `
select s.id, s.merchant_id, s.category_id, s.name, s.price, s.image_url, s.is_active,
  c.code as category_code, c.name -> $1 as category_name
from service s
JOIN service_category c on s.category_id = c.id
where merchant_id = $2 and deleted = false`,
      [lang, merchantId],
    );
    if (!rows[0]) {
      return [];
    }
    const services = rows;
    services.forEach(service => {
      service.image_url = FileUploader.getUrl(service.image_url);
    });
    return services;
  }
  public async getAllServices(lang: any, customerId): Promise<ServiceInterface[]> {
    const services: ServiceInterface[] = [];
    const { rows } = await pg.query(
      `select s.id, s.merchant_id, s.category_id, s.name, s.price, s.image_url,
      c.code as category_code, c.name -> $1 as category_name
    from service s
    JOIN service_category c on s.category_id = c.id
    where is_active = true and deleted = false`,
      [lang],
    );
    if (!rows[0]) return [];
    rows.forEach(service => {
      service.image_url = FileUploader.getUrl(service.image_url);
      services.push(service);
    });
    const { rows: saved } = await pg.query(`Select * from customer_saved_service where customer_id =$1`, [customerId]);
    if (saved[0]) {
      services.forEach(service => {
        saved.forEach(save => {
          if (service.id === save.service_id && save.customer_id === customerId) {
            service.saved = true;
          }
        });
      });
    }
    return services;
  }
  public async getOneById(merchantId, serviceId, lang): Promise<any> {
    const { rows } = await pg.query(
      `
select s.*, c.code as category_code, c.name -> $3 as category_name
from service s
JOIN service_category c on s.category_id = c.id
where s.id = $1 and s.merchant_id = $2 and s.deleted = false`,
      [serviceId, merchantId, lang],
    );
    if (!rows[0]) throw new CustomError('SERVICE_NOT_FOUND');
    rows[0].image_url = FileUploader.getUrl(rows[0].image_url);
    return rows[0];
  }
  public async deleteOneById(merchantId, serviceId, lang): Promise<any> {
    const { rows } = await pg.query(`Select * from service where id = $1 and merchant_id = $2`, [serviceId, merchantId]);
    if (!rows[0]) throw new CustomError('SERVICE_NOT_FOUND');
    const { rows: message } = await pg.query(
      `update service
                    set is_active = false,
                        deleted   = true
                    where id = $1
                      and merchant_id = $2
                      and deleted = false returning (select message from message where name = 'SERVICE_DELETED')`,
      [serviceId, merchantId],
    );
    return message[lang];
  }
  public async updateService(merchantId, service: ServiceUpdate, lang, image?: any): Promise<any> {
    const { rows } = await pg.query(`Select * from service where merchant_id = $1 and id = $2`, [merchantId, service.id]);
    if (!rows[0]) throw new CustomError('SERVICE_NOT_FOUND');

    const name = service.name || rows[0].name;
    const categoryId = service.categoryId || rows[0].category_id;
    const price = service.price || rows[0].price;
    const isActive = service.isActive || rows[0].is_active;
    if (image || service.deleteImage) {
      await this.fileUploader.deleteFile(`${rows[0].image_url}`);
      if (image) {
        const uploadPath = await this.fileUploader.uploadFile(image, `${rows[0].id}.${image.name.split('.').pop()}`);
        await pg.query(`Update service set image_url = $1 where id = $2`, [uploadPath, service.id]);
      } else {
        await pg.query(`Update service set image_url = $1 where id = $2`, [null, service.id]);
      }
    }
    const { rows: message } = await pg.query(
      `Update service set name = $1, price = $2, category_id = $3,is_active = $4 where id = $5 returning (select message from message where name = 'SERVICE_UPDATED')`,
      [name, price, categoryId, isActive, service.id],
    );
    return message[0].message[lang];
  }
}
