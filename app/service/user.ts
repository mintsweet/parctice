import { Service } from 'egg';
import { Model } from 'mongoose';
import { UserSchema } from '@/model/user';

export default class UserService extends Service {
  private user: Model<UserSchema>;

  constructor(ctx) {
    super(ctx);
    this.user = ctx.model.User;
  }

  public create(body) {
    return this.user.create(body);
  }

  public findOne(query) {
    return this.user.findOne(query);
  }
}
