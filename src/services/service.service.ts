import { Service } from 'typedi';
import pg from '@database';
import { ServiceInterface, ServiceUpdate } from '@interfaces/service.interface';
import { FileUploader } from '@utils/imageStorage';
import { CustomError } from '@exceptions/CustomError';
import base64url from 'base64url';
import * as crypto from 'crypto';

@Service()
export class ServiceService {
  private fileUploader;
  constructor() {
    this.fileUploader = new FileUploader('eu-north-1', 'image-24');
  }
  public async createService(serviceData: ServiceInterface, lang: any, image?: any): Promise<ServiceInterface> {
    const { name, merchant_id, categoryId, isActive } = serviceData;
    const { rows } = await pg.query(`Select * from service where merchant_id=$1 and category_id=$2 and deleted = false`, [merchant_id, categoryId]);
    if (rows[0]) throw new CustomError('SERVICE_ALREADY_EXISTS');
    const newActive = isActive || false;
    const public_key = base64url(crypto.randomBytes(16));
    const { rows: services } = await pg.query(`call create_service($1, $2, $3, $4, $5, $6, null, null, null)`, [
      merchant_id,
      categoryId,
      name,
      newActive,
      public_key,
      serviceData.fields,
    ]);
    const { error_code, error_message, success_message } = services[0];
    if (error_code) throw new CustomError(error_code, error_message);
    const { rows: created } = await pg.query(`Select * from service where merchant_id = $1 and category_id=$2 and deleted = false`, [
      merchant_id,
      categoryId,
    ]);
    console.log(created);
    const service = created[0];
    console.log(service);
    if (image) {
      const uploadPath = await this.fileUploader.uploadFile(image, `${service.id}.${image.name.split('.').pop()}`);
      if (uploadPath) await pg.query(`Update service set image_url = $1 where id = $2`, [uploadPath, service.id]);
    }
    if (services[0]) {
      return success_message[lang];
    }
    throw new CustomError('DATABASE_ERROR');
  }
  public async getMerchantServices(merchantId: string, lang: any): Promise<ServiceInterface[]> {
    const { rows } = await pg.query(
      `
        select s.id, s.merchant_id, s.category_id, s.name, s.image_url, s.is_active,
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
      `select s.id, s.merchant_id, s.category_id, s.name, s.image_url,
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
    const { rows: saved } = await pg.query(
      `select service_id as id
                                            from customer_saved_service
                                            where customer_id = $1`,
      [customerId],
    );
    if (saved[0]) {
      services.forEach(service => {
        saved.forEach(save => {
          if (service.id === save.id) {
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
        select s.id, s.merchant_id, s.category_id, s.name, s.image_url, s.is_active, s.public_key,
               c.code as category_code, c.name -> $3 as category_name,
               (select json_agg(
                         json_build_object('id', f.id, 'name', f.name, 'type', f.type, 'order', f.order_num)
                         ) from service_field f where f.service_id = s.id) as fields
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
      `Update service set name = $1, category_id = $2,is_active = $3 where id = $4 returning (select message from message where name = 'SERVICE_UPDATED')`,
      [name, categoryId, isActive, service.id],
    );
    return message[0].message[lang];
  }
  public async getOneByQr(key): Promise<any> {
    const { rows } = await pg.query(`Select id, is_active from service where public_key = $1`, [key]);
    if (!rows[0]) throw new CustomError('SERVICE_NOT_FOUND');
    if (!rows[0].is_active) throw new CustomError('SERVICE_NOT_ACTIVE');
    console.log(rows[0].id);
    return rows[0].id;
  }
  public async getOnePublicById(id, lang): Promise<any> {
    const { rows } = await pg.query(
      `select s.id, s.merchant_id, s.category_id, s.name, s.image_url,
              c.code as category_code, c.name -> $2 as category_name,
              (select json_agg(
                        json_build_object('id', f.id, 'name', f.name, 'type', f.type, 'order', f.order_num)
                        ) from service_field f where f.service_id = s.id) as fields
       from service s
              JOIN service_category c on s.category_id = c.id
       where s.id = $1 and s.deleted = false and s.is_active = true`,
      [id, lang],
    );
    if (!rows[0]) throw new CustomError('SERVICE_NOT_FOUND');
    rows[0].image_url = FileUploader.getUrl(rows[0].image_url);
    return rows[0];
  }
}
