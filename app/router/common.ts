import { Application } from 'egg';

export default (app: Application) => {
  const { controller, router } = app;

  router.get('/audit-log', controller.common.queryAuditLog);
  router.get('/health-examination', controller.common.healthExamination);
};
