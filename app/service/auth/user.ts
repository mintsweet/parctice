import { Service } from 'egg';
import { Model } from 'mongoose';
import { AuthUserSchema } from '@/model/auth/user';

export default class AuthUserService extends Service {
  private user: Model<AuthUserSchema>;

  constructor(ctx) {
    super(ctx);
    this.user = ctx.model.Auth.User;
  }

  public create(body) {
    return this.user.create(body);
  }

  public deleteById(id) {
    return this.user.findByIdAndDelete(id);
  }

  public updateById(id, body) {
    return this.user.findByIdAndUpdate(id, body);
  }

  public findOne(query) {
    return this.user.findOne(query);
  }

  public findById(id) {
    return this.user.findById(id);
  }

  public find(query) {
    return this.user.find(query);
  }

  public count(query) {
    return this.user.countDocuments(query);
  }

  public async findPage(page = 1, size = 10, query = {}) {
    const total = await this.count(query);
    const list = await this.find(query)
      .skip((+page - 1) * size)
      .limit(+size);

    return { list, total, page, size };
  }
}
