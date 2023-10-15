import { Service } from 'typedi';
import pg from '@database';
import { HttpException } from '@exceptions/httpException';
import { ServiceInterface } from '@interfaces/service.interface';
import { FileUploader } from '@utils/imageStorage';
@Service()
export class ServiceService {
  public async createService(serviceData: ServiceInterface, logo: any): Promise<ServiceInterface> {
    const { name, price, merchant_id, category_id, isActive } = serviceData;
    const { rows } = await pg.query(`Select * from service where merchant_id=$1 and category_id=$2`, [merchant_id, category_id]);
    if (rows[0].exists) throw new HttpException(409, 'You have already  added service for this category');

    const { rows: service } = await pg.query(`INSERT INTO service(name,price,merchant_id,category_id,isActive) values ($1,$2,$3,$4,$5)`, [
      name,
      price,
      merchant_id,
      category_id,
      isActive,
    ]);
    if (logo) {
      const fileUploader: FileUploader = new FileUploader('eu-north-1', 'image-24');
    }
    if (service[0].exists) return service[0];
    throw new HttpException(403, 'Error creating service');
  }
}
