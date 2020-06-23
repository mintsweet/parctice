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

  public async createTopic() {
    const { id } = this.ctx.user;
    const { body } = this.ctx.request;
    const { title, content, tab_id } = body;

    if (!title) {
      return this.ctx.failure({ code: 20014 });
    }

    if (!content) {
      return this.ctx.failure({ code: 20015 });
    }

    if (!tab_id) {
      return this.ctx.failure({ code: 20016 });
    }

    await this.ctx.service.topic.createTopic(title, content, tab_id, id);
    this.ctx.success();
  }

  public async deleteTopic() {
    const { id: author_id } = this.ctx.user;
    const { id } = this.ctx.params;

    try {
      await this.ctx.service.topic.deleteTopic(id, author_id);
      this.ctx.success();
    } catch (err) {
      this.ctx.failure({ code: err });
    }
  }

  public async updateTopic() {
    const { id: author_id } = this.ctx.user;
    const { id } = this.ctx.params;
    const { body } = this.ctx.request;

    try {
      await this.ctx.service.topic.updateTopic(id, body, author_id);
      this.ctx.success();
    } catch (err) {
      this.ctx.failure({ code: err });
    }
  }

  public async getTopicDetail() {
    const { id } = this.ctx.params;
    try {
      const data = await this.ctx.service.topic.getTopicDetail(id);
      this.ctx.success({ data });
    } catch (err) {
      this.ctx.failure({ code: err });
    }
  }

  public async queryTopic() {
    const { page = 1, size = 10, ...condition } = this.ctx.query;
    const data = await this.ctx.service.topic.queryTopic(page, size, condition);
    this.ctx.success({ data });
  }
}
