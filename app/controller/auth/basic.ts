import { Controller } from 'egg';
import * as md5 from 'md5';
import { cloneDeep, flattenDeep, uniq } from 'lodash';
import rbac from '@/rbac';

const filterRBAC = (data: any, has: any[]) => {
  const result: any = [];

  data.forEach((item: any) => {
    if (has.includes(item.path) && item.menu) {
      if (item.routes) {
        item.routes = filterRBAC(item.routes, has);
      }
      result.push(item);
    }
  });

  return result;
};

export default class AuthBasicController extends Controller {
  public async login() {
    const { username, password } = this.ctx.request.body;
    const { saltPassword } = this.ctx.app.config;

    const [user] = await this.ctx.service.auth.user
      .aggregate()
      .match({
        username,
        password: md5(`${saltPassword}${password}`),
      })
      .lookup({
        from: 'auth_group',
        localField: 'role',
        foreignField: '_id',
        as: 'group',
      })
      .unwind({
        path: '$group',
        preserveNullAndEmptyArrays: true,
      })
      .addFields({
        permissions: '$group.permissions',
      })
      .project({
        group: 0,
      });

    if (!user) {
      return this.ctx.failure({ code: 20001 });
    }

    this.ctx.login({
      id: user._id,
      username,
      permissions: user.permissions,
    });

    this.ctx.success();
  }

  public logout() {
    this.ctx.logout();
    this.ctx.success();
  }

  public getInfo() {
    if (!this.ctx.isAuthenticated()) {
      return this.ctx.failure({ code: 20002 });
    }

    const { username, permissions } = this.ctx.user;

    const flatAuth = uniq(
      flattenDeep(
        permissions.map((item: string) => {
          const urlList = item.split('/').filter(Boolean);
          return urlList.map(
            (_, index) => `/${urlList.slice(0, index + 1).join('/')}`,
          );
        }),
      ),
    );

    this.ctx.success({
      data: {
        username,
        siderbar: filterRBAC(cloneDeep(rbac), flatAuth),
      },
    });
  }
}
