import { EggAppConfig, EggAppInfo, PowerPartial, Context } from 'egg';

export default (appInfo: EggAppInfo) => {
  const config = {
    keys: appInfo.name + '_1587610971751_279',
    skipAuthentication: false,
    saltPassword: 'hawthorn',
    security: {
      csrf: {
        enable: false,
      },
    },

    auditLog: {
      model: {
        expand: {
          username: String,
          code: Number,
          msg: String,
          data: Object,
        },
      },
      extra: (ctx: Context) => {
        return {
          ...ctx.body,
          username: ctx.user?.username || ctx.request.body.username,
        };
      },
    },
  } as PowerPartial<EggAppConfig>;

  return config;
};
