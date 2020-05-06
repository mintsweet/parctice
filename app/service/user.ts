import Service from '@/core/BaseService';

export default class UserService extends Service {
  constructor(ctx) {
    super(ctx);
    this.model = ctx.model.User;
  }
}
