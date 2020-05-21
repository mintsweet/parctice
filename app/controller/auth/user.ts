import { Controller } from 'egg';
import * as md5 from 'md5';

export default class AuthUserController extends Controller {
  public async create() {
    const { body } = this.ctx.request;
    const { username, password } = body;

    const existUser = await this.ctx.service.auth.user.findOne({ username });

    if (existUser) {
      return this.ctx.failure({ code: 20006 });
    }

    const { saltPassword } = this.ctx.app.config;
    const result = await this.ctx.service.auth.user.create({
      ...body,
      password: md5(`${saltPassword}${password}`),
    });

    this.ctx.success({ data: result.id });
  }

  public async delete() {
    const { id } = this.ctx.params;

    await this.service.auth.user.deleteById(id);

    this.ctx.success();
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

    this.ctx.success({ data: result?._id });
  }

  public async query() {
    const { page, size, ...condition } = this.ctx.query;

    const [result] = await this.ctx.service.auth.user
      .aggregate()
      .match(condition)
      .lookup({
        from: 'auth_group',
        localField: 'role',
        foreignField: '_id',
        as: 'role',
      })
      .unwind({
        path: '$role',
        preserveNullAndEmptyArrays: true,
      })
      .project({
        username: 1,
        roleName: '$role.name',
        roleRemark: '$role.remark',
        createdAt: 1,
      })
      .facet({
        list: [
          {
            $skip: +((page - 1) * size),
          },
          {
            $limit: +size,
          },
        ],
        total: [
          {
            $count: 'count',
          },
        ],
      })
      .project({
        list: '$list',
        count: {
          $arrayElemAt: ['$total', 0],
        },
      })
      .project({
        list: 1,
        total: '$count.count',
      });

    this.ctx.success({ data: result });
  }
}
