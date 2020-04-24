import { Controller } from 'egg';
import * as md5 from 'md5';
import { UserSchema } from '@/model/user';

export default class UserController extends Controller {
  public async signup() {
    const {
      body: { username, password },
    } = this.ctx.request;

    const user: UserSchema | null = await this.ctx.service.user.findOne({
      username,
    });

    if (user) {
      return this.ctx.failure({ msg: '当前用户名已注册' });
    }

    const { saltPassword } = this.ctx.app.config;
    await this.ctx.service.user.create({
      username,
      password: md5(`${saltPassword}${password}`),
    });

    return this.ctx.success();
  }
}
