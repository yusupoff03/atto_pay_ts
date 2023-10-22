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
console.log('Server is up');
app.listen();
