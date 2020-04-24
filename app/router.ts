import { Application } from 'egg';
import CommonRouter from '@/router/common';

export default (app: Application) => {
  CommonRouter(app);
};
