import { Application } from 'egg';

export default (app: Application) => {
  const { router, controller } = app;

  router.get('/audit-log', controller.auditLog.query);
};
