import request from 'supertest';
import { App } from '@/app';
import pg from '@database';
import { CreateCustomerDto } from '@dtos/customer.dto';
import { CustomersRoute } from '@routes/customers.route';

afterAll(async () => {
  await new Promise<void>(resolve => setTimeout(() => resolve(), 500));
  await pg.end();
});

describe('Testing Auth', () => {
  describe('[POST] /register', () => {
    const customerRoute = new CustomersRoute();
    const app = new App([customerRoute]);
    const userData: CreateCustomerDto = {
      name: 'name',
      phone: '998949315433',
      password: 'password12',
    };
    it('response should have the Create userData', async () => {
      const response = await request(app.getServer()).post('/customer/register').send(userData);
      expect(response.statusCode).toBe(201);
    });
    it('validation error', async () => {
      userData.password = '';
      const response = await request(app.getServer()).post('/customer/register').send(userData);
      expect(response.statusCode).toBe(400);
    });
  });

  describe('[POST] /login', () => {
    it('response should have the Set-Cookie header with the Authorization token', async () => {
      const userData: CreateCustomerDto = {
        name: 'name',
        phone: '998949315431',
        password: 'password12',
      };
      const customerRoute = new CustomersRoute();
      const app = new App([customerRoute]);

      const response = await request(app.getServer()).post('/customer/login').send(userData);
      expect(response.statusCode).toBe(200);
    });
  });
});
