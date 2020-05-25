import { Application } from 'egg';
import CommonRouter from '@/router/common';
import UserRouter from '@/router/user';
// auth
import AuthBasicRouter from '@/router/auth/basic';
import AuthGroupRouter from '@/router/auth/group';
import AuthUserRouter from '@/router/auth/user';

import Dict from '@/router/dict';

export default (app: Application) => {
  CommonRouter(app);
  UserRouter(app);

  AuthBasicRouter(app);
  AuthGroupRouter(app);
  AuthUserRouter(app);

  Dict(app);
};
