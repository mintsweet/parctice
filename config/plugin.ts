import 'tsconfig-paths/register';
import { EggPlugin } from 'egg';

const plugin: EggPlugin = {
  mongoose: {
    enable: true,
    package: 'egg-mongoose',
  },
  passport: {
    enable: true,
    package: 'egg-passport',
  },
};

export default plugin;
