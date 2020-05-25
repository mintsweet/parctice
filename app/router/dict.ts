import { Application } from 'egg';

export default (app: Application) => {
  const { controller, router } = app;

  router.get('/dict', controller.dict.query);
  router.get('/dict/:key', controller.dict.getOne);
  router.put('/dict/:key', controller.dict.update);
};
