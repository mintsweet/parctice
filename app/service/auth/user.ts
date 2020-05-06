import Service from '@/core/BaseService';

export default class AuthUserService extends Service {
  constructor(ctx) {
    super(ctx);
    this.model = ctx.model.Auth.User;
  }
}
