import { Application } from 'egg';

export default (app: Application) => {
  const { router, controller } = app;

  router.post('/tab', controller.topic.createTab);
  router.delete('/tab/:id', controller.topic.deleteTab);
  router.put('/tab/:id', controller.topic.updateTab);
  router.get('/tabs', controller.topic.queryTab);
  router.post('/topic', controller.topic.createTopic);
  router.delete('/topic/:id', controller.topic.deleteTopic);
  router.put('/topic/:id', controller.topic.updateTopic);
  router.get('/topic/:id', controller.topic.getTopicDetail);
  router.get('/topics', controller.topic.queryTopic);
};
