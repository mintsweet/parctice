import { Controller } from 'egg';
import * as md5 from 'md5';

export default class AuthUserController extends Controller {
  public async create() {
    const { body } = this.ctx.request;
    const { username, password } = body;

    const existUser = await this.ctx.service.auth.user.findOne({ username });

    if (existUser) return this.ctx.failure();

    const { saltPassword } = this.ctx.app.config;
    const result = await this.ctx.service.auth.user.create({
      ...body,
      password: md5(`${saltPassword}${password}`),
    });

    return this.ctx.success({ data: result.id });
  }

  public async delete() {
    const { id } = this.ctx.params;

    await this.service.auth.user.deleteById(id);

    return this.ctx.success();
  }

  public async update() {
    const { id } = this.ctx.params;
    const { body } = this.ctx.request;
    const { password } = body;

    if (password) {
      const { saltPassword } = this.ctx.app.config;
      body.password = md5(`${saltPassword}${password}`);
    }

    const result = await this.ctx.service.auth.user.updateById(id, body);

    return this.ctx.success({ data: result?._id });
  }

  public async query() {
    const { page, size, ...condition } = this.ctx.query;

    const result = await this.ctx.service.auth.user.findPage(
      page,
      size,
      condition,
    );

    return this.ctx.success({ data: result });
  }
}
