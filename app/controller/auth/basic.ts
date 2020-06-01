import { Controller } from 'egg';
import * as md5 from 'md5';
import { cloneDeep, flattenDeep, uniq, sortBy } from 'lodash';
import rbac from '@/rbac';

const filterRBAC = (data: any, has: any[]) => {
  const result: any = [];

  data.forEach((item: any) => {
    if (has.includes(item.path) && item.name) {
      if (item.routes) {
        item.routes = filterRBAC(item.routes, has);
      }
      result.push(item);
    }
  });

  return result;
};

const getRbacTree = (data: any) => {
  const result: any = [];

  data.forEach((item: any) => {
    if (item.routes) {
      item.routes = getRbacTree(item.routes);
    }
    result.push(item);
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
        role: 0,
        group: 0,
      });

    if (!user) {
      return this.ctx.failure({ code: 20001 });
    }

    this.ctx.login({
      id: user._id,
      username,
      permissions: sortBy([
        ...user.permissions.checked,
        ...user.permissions.halfChecked,
      ]),
    });

    this.ctx.success();
  }

  public logout() {
    this.ctx.logout();
    this.ctx.success();
  }

  public getInfo() {
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
        sidebar: filterRBAC(cloneDeep(rbac), flatAuth),
      },
    });
  }

  public getSystemTree() {
    this.ctx.success({
      data: getRbacTree(rbac),
    });
  }

  public async updateInfo() {
    const { id } = this.ctx.user;

    await this.ctx.service.auth.user.updateById(id, this.ctx.request.body);

    this.ctx.success();
  }

  public async updatePassword() {
    const { id } = this.ctx.user;
    const { oldPass, newPass } = this.ctx.request.body;
    const { saltPassword } = this.ctx.app.config;

    const user = await this.ctx.service.auth.user.findById(id);

    if (user.password !== md5(`${saltPassword}${oldPass}`)) {
      return this.ctx.failure({ code: 20007 });
    }

    await this.ctx.service.auth.user.updateById(id, {
      password: md5(`${saltPassword}${newPass}`),
    });

    this.ctx.success();
  }
}
