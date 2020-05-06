import { Application } from 'egg';
import CommonRouter from '@/router/common';
import UserRouter from '@/router/user';
import AuthGroupRouter from '@/router/auth/group';
import AuthUserRouter from '@/router/auth/user';

export default (app: Application) => {
  CommonRouter(app);
  UserRouter(app);

  // 权限组
  AuthGroupRouter(app);
  // 管理员
  AuthUserRouter(app);
};
