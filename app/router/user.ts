import { Application } from 'egg';

export default (app: Application) => {
  const { router, controller } = app;

  router.post('/signup', controller.user.signup);
  router.post('/signin', controller.user.signin);
};
