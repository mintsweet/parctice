import { Response } from '../interface';

module.exports = {
  success({
    status = 200,
    code = 0,
    msg = '',
    data = {},
  }: Response = {}): void {
    this.body = {
      code,
      msg,
      data,
    };
    this.status = status;
  },

  failure({
    status = 200,
    code = 20002,
    msg = '',
    data = {},
  }: Response = {}): void {
    this.body = {
      code,
      msg,
      data,
    };
    this.status = status;
  },
};
