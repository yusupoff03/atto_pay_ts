// import request from 'supertest';
// import { App } from '../app';
// import pg from '../database';
// import { CreateCustomerDto } from '../dtos/customer.dto';
// import { CustomersRoute } from '../routes/customers.route';
//
// afterAll(async () => {
//   await new Promise<void>(resolve => setTimeout(() => resolve(), 500));
//   pg.end();
// });
//
// describe('Testing Customers', () => {
//   describe('[GET] /customer', () => {
//     it('response statusCode 200 / findAll', async () => {
//       const customerRoute = new CustomersRoute();
//       const app = new App([customerRoute]);
//
//       return await request(app.getServer()).get(`${customerRoute.path}`).expect(200);
//     });
//   });
//
//   describe('[GET] /customer/:id', () => {
//     it('response statusCode 200 / findOne', async () => {
//       const customerRoute = new CustomersRoute();
//       const app = new App([customerRoute]);
//
//       return await request(app.getServer())
//         .get(`${customerRoute.path}`)
//         .query({
//           userId: 1,
//         })
//         .expect(200);
//     });
//   });
//
//   describe('[POST] /customer', () => {
//     it('response statusCode 201 / created', async () => {
//       const userData: CreateCustomerDto = {
//         phone: 'example@email.com',
//         password: 'password',
//       };
//       const customerRoute = new CustomersRoute();
//       const app = new App([customerRoute]);
//
//       return await request(app.getServer()).post(`${customerRoute.path}`).send(userData).expect(201);
//     });
//   });
//
//   describe('[PUT] /customer/:id', () => {
//     it('response statusCode 200 / updated', async () => {
//       const userId = 1;
//       const userData: CreateCustomerDto = {
//         phone: 'example@email.com',
//         password: 'password',
//       };
//       const customerRoute = new CustomersRoute();
//       const app = new App([customerRoute]);
//
//       return await request(app.getServer()).put(`${customerRoute.path}/${userId}`).send(userData).expect(200);
//     });
//   });
//
//   describe('[DELETE] /customer/:id', () => {
//     it('response statusCode 200 / deleted', async () => {
//       const userId = 1;
//       const customerRoute = new CustomersRoute();
//       const app = new App([customerRoute]);
//
//       return await request(app.getServer()).delete(`${customerRoute.path}/${userId}`).expect(200);
//     });
//   });
// });
//# sourceMappingURL=users.test.ts.map
