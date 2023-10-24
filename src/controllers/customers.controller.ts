import { NextFunction, Request, Response } from 'express';
import { Container } from 'typedi';
import { Customer, UpdateCustomerData } from '@interfaces/customers.interface';
import { CustomerService } from '@services/customers.service';
import { DataStoredInToken } from '@interfaces/auth.interface';
import { POSTGRES_DB, SECRET_KEY } from '@config';
import { verify } from 'jsonwebtoken';
import { FileUploader } from '@utils/imageStorage';

export class CustomersController {
  public customer = Container.get(CustomerService);

  public getCustomers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const findAllCustomersData: Customer[] = await this.customer.findAllCustomer();

      res.status(200).json({ data: findAllCustomersData, message: 'findAll' });
    } catch (error) {
      next(error);
    }
  };

  public getCustomerById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const customerId = this.getCustomerId(req);
      const customer: Customer = await this.customer.findCustomerById(customerId);
      customer.image_url = FileUploader.getUrl(customer.image_url);
      res.status(200).json(customer);
    } catch (error) {
      next(error);
    }
  };
  public addServiceToSaved = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const customerId = this.getCustomerId(req);
      const { serviceId } = req.body;
      await this.customer.addToSaved(customerId, serviceId);
      res.status(200).json({
        success: true,
      });
    } catch (error) {
      next(error);
    }
  };
  public deleteServiceFromSaved = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const customerId = this.getCustomerId(req);
      const { serviceId } = req.body;
      await this.customer.deleteFromSaved(customerId, serviceId);
      res.status(200).json({
        success: true,
      });
    } catch (error) {
      next(error);
    }
  };
  public updateCustomer = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const customerData: UpdateCustomerData = req.body;
      const customerId = this.getCustomerId(req);
      const updateCustomerData: Customer = await this.customer.updateCustomer(customerId, customerData, req.files?.avatar);
      res.status(200).json({ data: updateCustomerData, message: 'updated' });
    } catch (error) {
      next(error);
    }
  };
  public updateCustomerLang = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const customerId = this.getCustomerId(req);
      const { lang } = req.body;
      await this.customer.updateCustomerLang(customerId, lang);
      res.status(200).json({ success: true });
    } catch (error) {
      next(error);
    }
  };

  public deleteCustomer = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const cookie = req.cookies['Authorization'];
      const { customerId } = req.body;
      console.log(customerId);
      const decodedToken = verify(cookie, SECRET_KEY) as DataStoredInToken;
      const customerId2 = decodedToken.id;
      if (customerId !== customerId2) {
        res.status(401).json({
          message: `Unexpected token`,
        });
        return;
      }
      const deleteCustomerData: boolean = await this.customer.deleteCustomer(customerId);
      res.status(200).json({ data: deleteCustomerData, message: 'deleted' });
    } catch (error) {
      next(error);
    }
  };
  public getOtp = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { phone } = req.body;
      const otp = await this.customer.getOtp(phone);
      res.status(200).json({
        otp: otp,
      });
    } catch (error) {
      next(error);
    }
  };
  private getCustomerId = (req: Request): string => {
    const cookie = req.headers.authorization;
    const decodedToken = verify(cookie, SECRET_KEY) as DataStoredInToken;
    return decodedToken.id;
  };
}
