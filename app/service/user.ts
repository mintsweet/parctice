import { Service } from 'egg';
import { Model } from 'mongoose';
import * as md5 from 'md5';
import { UserModel } from '@/model/user';

export default class UserService extends Service {
  private user: Model<UserModel>;

  constructor(ctx) {
    super(ctx);
    this.user = ctx.model.User.Index;
  }

  /**
   * 创建用户
   * @param email 邮箱
   * @param password 密码
   * @param nickname 昵称
   */
  public async createUser(email, password, nickname) {
    let exist = await this.user.findOne({ email });
    if (exist) {
      throw 30001;
    }

    exist = await this.user.findOne({ nickname });
    if (exist) {
      throw 30002;
    }

    const { saltPassword } = this.ctx.app.config;

    await this.user.create({
      email,
      password: md5(`${saltPassword}${password}`),
      nickname,
    });
  }

  /**
   * 获取用户
   * @param email 邮箱
   * @param password 密码
   */
  public async getUser(email, password) {
    const { saltPassword } = this.ctx.app.config;

    const user = await this.user
      .findOne({
        email,
        password: md5(`${saltPassword}${password}`),
      })
      .select({
        avatar: 1,
        location: 1,
        signature: 1,
        score: 1,
        _id: 1,
        email: 1,
        nickname: 1,
      });

    if (!user) {
      throw 30003;
    }

    return user;
  }
}
