import { Application } from 'egg';
import CommonRouter from '@/router/common';
import UserRouter from '@/router/user';

export default (app: Application) => {
  CommonRouter(app);
  UserRouter(app);
};
