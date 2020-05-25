import { Service } from 'egg';
import { Model } from 'mongoose';

export default class BaseService extends Service {
  protected model: Model<any>;

  public create(body) {
    return this.model.create(body);
  }

  public deleteById(id) {
    return this.model.findByIdAndDelete(id);
  }

  public updateById(id, body) {
    return this.model.findByIdAndUpdate(id, body);
  }

  public updateOne(query, body) {
    return this.model.updateOne(query, body);
  }

  public findOne(query) {
    return this.model.findOne(query);
  }

  public findById(id) {
    return this.model.findById(id);
  }

  public find(query) {
    return this.model.find(query);
  }

  public count(query) {
    return this.model.countDocuments(query);
  }

  public aggregate() {
    return this.model.aggregate([]);
  }

  public async findPage(
    { page = 1, size = 10, query },
    select?: string | object,
  ) {
    const total = await this.count(query);
    const list = await this.find(query)
      .select(select)
      .sort({ cretaedAt: -1 })
      .skip((+page - 1) * size)
      .limit(+size);

    return { list, total };
  }
}
