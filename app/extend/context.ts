import { Response } from '../interface';

import zhErrorCode from './locale/zh-CN';
import enErrorCode from './locale/en-US';

const errorCodeMap = {
  zh: zhErrorCode,
  'zh-CN': zhErrorCode,
  en: enErrorCode,
  'en-US': enErrorCode,
};

module.exports = {
  success({ status = 200, code = 0, data = {} }: Response = {}): void {
    this.body = {
      code,
      msg: errorCodeMap[this.lang][code],
      data,
    };
    this.status = status;
  },

  failure({ status = 200, code = 10000, data = {} }: Response = {}): void {
    this.body = {
      code,
      msg: errorCodeMap[this.lang][code],
      data,
    };
    this.status = status;
  },
};
