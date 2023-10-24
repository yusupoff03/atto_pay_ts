// import request from 'supertest';
// import { App } from '@/app';
// import pg from '@database';
// import { CreateCustomerDto } from '@dtos/customer.dto';
// import { AuthRoute } from '@routes/auth.route';
//
// afterAll(async () => {
//   await new Promise<void>(resolve => setTimeout(() => resolve(), 500));
//   pg.end();
// });
//
// describe('Testing Auth', () => {
//   describe('[POST] /signup', () => {
//     it('response should have the Create userData', async () => {
//       const userData: CreateCustomerDto = {
//         phone: 'example@phone.com',
//         password: 'password',
//       };
//       const authRoute = new AuthRoute();
//       const app = new App([authRoute]);
//
//       return await request(app.getServer()).post('/signup').send(userData).expect(201);
//     });
//   });
//
//   describe('[POST] /login', () => {
//     it('response should have the Set-Cookie header with the Authorization token', async () => {
//       const userData: CreateCustomerDto = {
//         phone: 'example1@phone.com',
//         password: 'password',
//       };
//
//       const authRoute = new AuthRoute();
//       const app = new App([authRoute]);
//
//       return await request(app.getServer())
//         .post('/login')
//         .send(userData)
//         .expect('Set-Cookie', /^Authorization=.+/);
//     });
//   });
// });
