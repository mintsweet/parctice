import { Application } from 'egg';

// 基础权限
export default (app: Application) => {
  const { router, controller } = app;

  router.post('/auth/login', controller.auth.basic.login);
  router.post('/auth/logout', controller.auth.basic.logout);
  router.get('/auth/info', controller.auth.basic.getInfo);
  router.get('/auth/system-tree', controller.auth.basic.getSystemTree);
};
