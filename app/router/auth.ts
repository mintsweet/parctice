import { Application } from 'egg';

export default (app: Application) => {
  const { router, controller } = app;

  // 权限组
  router.post('/auth/group', controller.auth.createGroup);
  router.delete('/auth/group/:id', controller.auth.deleteGroup);
  router.put('/auth/group/:id', controller.auth.updateGroup);
  router.get('/auth/group', controller.auth.queryGroup);

  // 管理员
  router.post('/auth/user', controller.auth.createUser);
  router.delete('/auth/user/:id', controller.auth.deleteUser);
  router.put('/auth/user/:id', controller.auth.updateUser);
  router.get('/auth/user', controller.auth.queryUser);
};
