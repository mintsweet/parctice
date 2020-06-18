import { Response } from '../interface';

import errorCodeMap from './error-code';

module.exports = {
  success({ status = 200, code = 0, data = {} }: Response = {}): void {
    this.body = {
      code,
      msg: errorCodeMap[code],
      data,
    };
    this.status = status;
  },

  failure({ status = 200, code = 10000, data = {} }: Response = {}): void {
    this.body = {
      code,
      msg: errorCodeMap[code],
      data,
    };
    this.status = status;
  },
};
