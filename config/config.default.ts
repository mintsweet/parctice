import { EggAppConfig, EggAppInfo, PowerPartial } from 'egg';

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
  } as PowerPartial<EggAppConfig>;

  return config;
};
