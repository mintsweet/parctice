import { Context } from 'egg';

export default () => async (ctx: Context, next) => {
  const { config } = ctx.app;

  if (config.skipAuthentication) {
    return await next();
  }

  if (!ctx.isAuthenticated()) {
    return ctx.failure({ status: 401, code: 20002 });
  }

  return await next();
};
