import { Controller } from 'egg';
import { REGEXP_EMAIL, REGEXP_PASSWORD } from '@/common/constants';

export default class UserController extends Controller {
  public async signup() {
    const { body } = this.ctx.request;
    const { email, password, nickname } = body;

    if (!email || !REGEXP_EMAIL.test(email)) {
      return this.ctx.failure({ code: 40001 });
    }

    if (!password || !REGEXP_PASSWORD.test(password)) {
      return this.ctx.failure({ code: 40002 });
    }

    if (!nickname || nickname.length > 8 || nickname.length < 2) {
      return this.ctx.failure({ code: 40003 });
    }

    try {
      await this.ctx.service.user.createUser(email, password, nickname);
      this.ctx.success();
    } catch (err) {
      this.ctx.failure({ code: err });
    }
  }

  public async signin() {
    const { body } = this.ctx.request;
    const { email, password } = body;

    if (!email || !REGEXP_EMAIL.test(email)) {
      return this.ctx.failure({ code: 40001 });
    }

    try {
      const user = await this.ctx.service.user.getUser(email, password);

      this.ctx.login({
        id: user._id,
        username: user.email,
      });

      this.ctx.success({ data: user });
    } catch (err) {
      this.ctx.failure({ code: err });
    }
  }
}
