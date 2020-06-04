import { Context } from 'egg';

export default (key?: string | string[]) => async (ctx: Context, next) => {
  const { config } = ctx.app;

  if (config.skipAuthentication) {
    return await next();
  }

  if (!ctx.isAuthenticated()) {
    return ctx.failure({ status: 401, code: 20002 });
  }

  if (key) {
    const { permissions } = ctx.user;
    const hasAuth = Array.isArray(key)
      ? key.find(item => permissions.includes(`/${item.split('.').join('/')}`))
      : permissions.includes(`/${key.split('.').join('/')}`);

    if (!hasAuth) {
      return ctx.failure({ status: 403, code: 20008 });
    }
  }

  await next();
};
