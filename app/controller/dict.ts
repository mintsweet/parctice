import { Controller } from 'egg';

export default class DictController extends Controller {
  public async query() {
    const data = await this.ctx.service.dict
      .aggregate()
      .group({
        _id: '$tag',
        dict: {
          $push: '$$ROOT',
        },
      })
      .sort({
        _id: -1,
      });

    this.ctx.success({ data });
  }

  public async getOne() {
    const { key } = this.ctx.params;

    const { value } = await this.ctx.service.dict.getValue(key);

    this.ctx.success({ data: value });
  }

  public async update() {
    const { key } = this.ctx.params;

    await this.ctx.service.dict.updateOne({ key }, this.ctx.request.body);

    this.ctx.success();
  }
}
