import { Application } from 'egg';

// 管理员
export default (app: Application) => {
  const { router, controller } = app;

  router.post('/auth/user', controller.auth.user.create);
  router.delete('/auth/user/:id', controller.auth.user.delete);
  router.put('/auth/user/:id', controller.auth.user.update);
  router.get('/auth/user', controller.auth.user.query);
};
