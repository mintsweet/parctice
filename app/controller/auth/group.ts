import { Controller } from 'egg';
import { Types } from 'mongoose';

export default class AuthGroupController extends Controller {
  public async create() {
    const { body } = this.ctx.request;
    const { name } = body;

    const existGroup = await this.ctx.service.auth.group.findOne({ name });
    if (existGroup) return this.ctx.failure();

    const result = await this.ctx.service.auth.group.create(body);

    return this.ctx.success({ data: result._id });
  }

  public async delete() {
    const { id } = this.ctx.params;

    const group = await this.ctx.service.auth.group.findById(id);

    if (!group) return this.ctx.failure();
    if (!group.modifiable) return this.ctx.failure();

    const userCount = await this.ctx.service.auth.user.count({
      role: Types.ObjectId(id),
    });

    if (userCount) return this.ctx.failure();

    await this.ctx.service.auth.group.deleteById(id);

    return this.ctx.success();
  }

  public async update() {
    const { id } = this.ctx.params;
    const { body } = this.ctx.request;

    const group = await this.ctx.service.auth.group.findById(id);

    if (!group) return this.ctx.failure();
    if (!group.modifiable) return this.ctx.failure();

    const result = await this.ctx.service.auth.group.updateById(id, body);

    this.ctx.success({ data: result?._id });
  }

  public async query() {
    const { page, size, ...condition } = this.ctx.query;

    const result = await this.ctx.service.auth.group.findPage(
      page,
      size,
      condition,
    );

    return this.ctx.success({ data: result });
  }
}
