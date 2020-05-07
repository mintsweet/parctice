import { EggAppConfig, PowerPartial } from 'egg';

export default () => {
  const config: PowerPartial<EggAppConfig> = {
    mongoose: {
      url: 'mongodb://127.0.0.1/hawthorn',
      options: {
        useUnifiedTopology: true,
      },
    },
  };
  return config;
};
