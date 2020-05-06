import { Service } from 'egg';
import { Model } from 'mongoose';
import { AuthGroupSchema } from '@/model/auth/group';

export default class AuthGroupService extends Service {
  private group: Model<AuthGroupSchema>;

  constructor(ctx) {
    super(ctx);
    this.group = ctx.model.Auth.Group;
  }

  public create(body) {
    return this.group.create(body);
  }

  public deleteById(id) {
    return this.group.findByIdAndDelete(id);
  }

  public updateById(id, body) {
    return this.group.findByIdAndUpdate(id, body);
  }

  public findOne(query) {
    return this.group.findOne(query);
  }

  public findById(id) {
    return this.group.findById(id);
  }

  public find(query) {
    return this.group.find(query);
  }

  public count(query) {
    return this.group.countDocuments(query);
  }

  public async findPage(page = 1, size = 10, query = {}) {
    const total = await this.count(query);
    const list = await this.find(query)
      .skip((+page - 1) * size)
      .limit(+size);

    return { list, total, page, size };
  }
}
