import Service from '@/core/BaseService';

export default class AuthGroupService extends Service {
  constructor(ctx) {
    super(ctx);
    this.model = ctx.model.Auth.Group;
  }
}
