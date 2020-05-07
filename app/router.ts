import { Application } from 'egg';
import CommonRouter from '@/router/common';
import UserRouter from '@/router/user';
import AuthBasicRouter from '@/router/auth/basic';
import AuthGroupRouter from '@/router/auth/group';
import AuthUserRouter from '@/router/auth/user';

export default (app: Application) => {
  CommonRouter(app);
  UserRouter(app);

  // 基础权限
  AuthBasicRouter(app);
  // 权限组
  AuthGroupRouter(app);
  // 管理员
  AuthUserRouter(app);
};
