import { App } from '@/app';
import { AuthRoute } from '@routes/auth.route';
import { UserRoute } from '@routes/users.route';
import { ValidateEnv } from '@utils/validateEnv';
import * as console from 'console';

ValidateEnv();

const app = new App([new AuthRoute(), new UserRoute()]);
console.log('Server is up');
app.listen();
