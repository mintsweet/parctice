import { Application } from 'egg';

export default (app: Application) => {
  const { router, controller } = app;

  router.post('/tab', controller.topic.createTab);
  router.delete('/tab/:id', controller.topic.deleteTab);
  router.put('/tab/:id', controller.topic.updateTab);
  router.get('/tabs', controller.topic.queryTab);
};
