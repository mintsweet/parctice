import { EggAppConfig, EggAppInfo, PowerPartial, Context } from 'egg';

export default (appInfo: EggAppInfo) => {
  const config = {
    keys: appInfo.name + '_1587610971751_279',
    skipAuthentication: false,
    middleware: ['language'],
    saltPassword: 'hawthorn',
    security: {
      csrf: {
        enable: false,
      },
    },

    auditLog: {
      model: {
        expansion: {
          username: String,
          code: Number,
          msg: String,
          data: Object,
        },
        func: (ctx: Context) => ({
          ...ctx.body,
          username: ctx.user?.username || ctx.body?.username,
        }),
      },
    },
  } as PowerPartial<EggAppConfig>;

  return config;
};
