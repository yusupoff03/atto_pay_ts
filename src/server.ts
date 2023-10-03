import { App } from '@/app';
import { AuthRoute } from '@routes/auth.route';
import { CustomersRoute } from '@routes/customers.route';
import { CardsRoute } from '@routes/cards.route';
import { ValidateEnv } from '@utils/validateEnv';
import * as console from 'console';

ValidateEnv();

const app = new App([new AuthRoute(), new CustomersRoute(), new CardsRoute()]);
console.log('Server is up');
app.listen();
