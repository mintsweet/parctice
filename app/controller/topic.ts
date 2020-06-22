import { Controller } from 'egg';

export default class UserController extends Controller {
  public async createTab() {
    const { body } = this.ctx.request;
    const { name, mark } = body;

    if (!name || name.length < 2 || name.length > 4) {
      return this.ctx.failure({ code: 20009 });
    }

    if (!mark || mark.length < 2 || mark.length > 6) {
      return this.ctx.failure({ code: 20010 });
    }

    try {
      await this.ctx.service.topic.createTab(name, mark);
      this.ctx.success();
    } catch (err) {
      this.ctx.failure({ code: err });
    }
  }

  public async deleteTab() {
    const { id } = this.ctx.params;

    try {
      await this.ctx.service.topic.deleteTab(id);
      this.ctx.success();
    } catch (err) {
      this.ctx.failure({ code: err });
    }
  }

  public async updateTab() {
    const { id } = this.ctx.params;
    const { body } = this.ctx.request;
    const { name, mark } = body;

    if (!name || name.length < 2 || name.length > 4) {
      return this.ctx.failure({ code: 20009 });
    }

    if (!mark || mark.length < 2 || mark.length > 6) {
      return this.ctx.failure({ code: 20010 });
    }

    try {
      await this.ctx.service.topic.updateTab(id, body);
      this.ctx.success();
    } catch (err) {
      this.ctx.failure({ code: err });
    }
  }

  public async queryTab() {
    const { query } = this.ctx.request;

    try {
      const list = await this.ctx.service.topic
        .queryTab({
          ...query,
          status: 'normal',
        })
        .select({
          name: 1,
          mark: 1,
        });
      return this.ctx.success({ data: list });
    } catch (err) {
      this.ctx.failure({ code: err });
    }
  }
}
