import { Application } from 'egg';

// 基础权限
export default (app: Application) => {
  const {
    router,
    controller,
    middleware: { auth },
    auditLog: { middleware: log },
  } = app;

  router.post(
    '/auth/login',
    log('Auth Baic', 'Login'),
    controller.auth.basic.login,
  );
  router.post('/auth/logout', auth(), controller.auth.basic.logout);
  router.get('/auth/info', auth(), controller.auth.basic.getInfo);
  router.get('/auth/system-tree', auth(), controller.auth.basic.getSystemTree);
  router.put(
    '/auth/info',
    auth(),
    log('Auth Basic', 'Update Info'),
    controller.auth.basic.updateInfo,
  );
  router.put(
    '/auth/password',
    auth(),
    log('Auth Basic', 'Update Password'),
    controller.auth.basic.updatePassword,
  );
};
