import { Controller } from 'egg';
import * as md5 from 'md5';

export default class UserController extends Controller {
  public async signup() {
    const {
      body: { username, password },
    } = this.ctx.request;

    const user = await this.ctx.service.user.findOne({
      username,
    });

    if (user) {
      return this.ctx.failure({ code: 30001 });
    }

    const { saltPassword } = this.ctx.app.config;
    await this.ctx.service.user.create({
      username,
      password: md5(`${saltPassword}${password}`),
    });

    this.ctx.success();
  }
}
