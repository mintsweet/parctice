import { Controller } from 'egg';

export default class AuditLog extends Controller {
  public async query() {
    const { page = 1, size = 10, ...condition } = this.ctx.query;

    const total = await this.app.auditLog.count(condition);
    const list = await this.app.auditLog
      .find(condition)
      .sort({ createdAt: -1 })
      .skip((+page - 1) * size)
      .limit(+size);

    return this.ctx.success({
      data: {
        list,
        total,
      },
    });
  }
}
