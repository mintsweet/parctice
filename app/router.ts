import { Application } from 'egg';
import CommonRouter from '@/router/common';
import UserRouter from '@/router/user';
// auth
import AuthBasicRouter from '@/router/auth/basic';
import AuthGroupRouter from '@/router/auth/group';
import AuthUserRouter from '@/router/auth/user';

import Dict from '@/router/dict';

import AuditLog from '@/router/audit-log';

import User from '@/router/user';
import Topic from '@/router/topic';

export default (app: Application) => {
  CommonRouter(app);
  UserRouter(app);

  AuthBasicRouter(app);
  AuthGroupRouter(app);
  AuthUserRouter(app);

  Dict(app);

  AuditLog(app);

  User(app);
  Topic(app);
};
