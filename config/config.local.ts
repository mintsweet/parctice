import { EggAppConfig, PowerPartial } from 'egg';

export default () => {
  const config: PowerPartial<EggAppConfig> = {
    mongoose: {
      url: 'mongodb://127.0.0.1/hawthorn',
      options: {
        useUnifiedTopology: true,
      },
    },
    redis: {
      client: {
        port: 6379,
        host: '127.0.0.1',
        password: '',
        db: 1,
      },
    },
  };
  return config;
};
