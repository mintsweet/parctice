import { Application } from 'egg';

// 权限组
export default (app: Application) => {
  const { router, controller } = app;

  router.post('/auth/group', controller.auth.group.create);
  router.delete('/auth/group/:id', controller.auth.group.delete);
  router.put('/auth/group/:id', controller.auth.group.update);
  router.get('/auth/group', controller.auth.group.query);
};
