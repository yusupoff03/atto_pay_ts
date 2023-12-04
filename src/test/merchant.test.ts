import pg from '@database';
import { MerchantRoute } from '@routes/merchant.route';
import { App } from '@/app';
import request from 'supertest';
afterAll(async () => {
  await new Promise<void>(resolve => setTimeout(() => resolve(), 500));
  await pg.end();
});

describe('Merchant tests', () => {
  describe('Merchant profile', () => {
    const merchantRoute: MerchantRoute = new MerchantRoute();
    const app: App = new App([merchantRoute]);
    it('Get merchant profile', async () => {
      const response = await request(app.getServer())
        .get('/merchant/profile')
        .set(
          'Authorization',
          `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImE3OGQ1MTRhLTIwMmYtNDc3My1iZjg4LWI2YmYyY2RhZTc1MSIsInJvbGUiOiJNZXJjaGFudCIsImlhdCI6MTcwMTE0NjczMCwiZXhwIjoxNzAxMTUwMzMwfQ.kip-tj1OHX2sM8RioDlTrTmk3a60OAIJOp8JgvTe1dU`,
        );
      expect(response.status).toBe(200);
    });
  });

});
