import { App } from '@/app';
import { AuthRoute } from '@routes/auth.route';
import { CustomersRoute } from '@routes/customers.route';
import { CardsRoute } from '@routes/cards.route';
import { ValidateEnv } from '@utils/validateEnv';
import { CurrencyRoute } from '@routes/currency.route';
import { CategoryRoute } from '@routes/category.route';
import { MerchantRoute } from '@routes/merchant.route';
import { ServiceRoute } from '@routes/service.route';
import { TransactionRoute } from '@routes/transaction.route';
import http from 'http';
import io from '@/socket/socket';

ValidateEnv();
const app = new App([
  new AuthRoute(),
  new CustomersRoute(),
  new CardsRoute(),
  new CurrencyRoute(),
  new CategoryRoute(),
  new MerchantRoute(),
  new ServiceRoute(),
  new TransactionRoute(),
]);
const server = http.createServer(app.getServer());
io.attach(server);
console.log('Server is up');
server.listen(3000);
