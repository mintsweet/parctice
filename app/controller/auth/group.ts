import { Controller } from 'egg';
import { Types } from 'mongoose';

export default class AuthGroupController extends Controller {
  public async create() {
    const { body } = this.ctx.request;
    const { name } = body;

    const existGroup = await this.ctx.service.auth.group.findOne({ name });

    if (existGroup) {
      return this.ctx.failure({ code: 20003 });
    }

    const result = await this.ctx.service.auth.group.create(body);

    this.ctx.success({ data: result._id });
  }

  public async delete() {
    const { id } = this.ctx.params;

    const group = await this.ctx.service.auth.group.findById(id);

    if (!group.modifiable) {
      return this.ctx.failure({ code: 20004 });
    }

    const userCount = await this.ctx.service.auth.user.count({
      role: Types.ObjectId(id),
    });

    if (userCount) {
      return this.ctx.failure({ code: 20005 });
    }

    await this.ctx.service.auth.group.deleteById(id);

    this.ctx.success();
  }

  public async update() {
    const { id } = this.ctx.params;
    const { body } = this.ctx.request;

    const group = await this.ctx.service.auth.group.findById(id);

    if (!group.modifiable) {
      return this.ctx.failure({ code: 20004 });
    }

    const result = await this.ctx.service.auth.group.updateById(id, body);

    this.ctx.success({ data: result?._id });
  }

  public async query() {
    const { page, size, all, ...condition } = this.ctx.query;

    if (all) {
      const result = await this.ctx.service.auth.group
        .find(condition)
        .select('_id name remark');

      return this.ctx.success({ data: result });
    }

    const result = await this.ctx.service.auth.group.findPage(
      page,
      size,
      condition,
    );

    this.ctx.success({ data: result });
  }
}
