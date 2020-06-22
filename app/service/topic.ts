import { Service } from 'egg';
import { Model } from 'mongoose';
import { TopicTabModel } from '@/model/topic/tab';

export default class TopicService extends Service {
  private tab: Model<TopicTabModel>;

  constructor(ctx) {
    super(ctx);
    this.tab = ctx.model.Topic.Tab;
  }

  /**
   * 创建话题标签
   * @param name 话题标签名称
   * @param mark 话题标签标识
   */
  public async createTab(name, mark) {
    let exist = await this.tab.findOne({ name });
    if (exist) {
      throw 20011;
    }

    exist = await this.tab.findOne({ mark });
    if (exist) {
      throw 20012;
    }

    await this.tab.create({ name, mark });
  }

  /**
   * 删除话题标签
   * @param id 话题标签ID
   */
  public async deleteTab(id) {
    const result = await this.tab.findByIdAndDelete(id);
    if (!result) {
      throw 20013;
    }
  }

  /**
   * 更新话题标签
   * @param id 话题标签ID
   * @param param1 话题标签内容
   */
  public async updateTab(id, { name, mark }) {
    let exist = await this.tab.findOne({ name });
    if (exist && exist._id.toString() !== id) {
      throw 20011;
    }

    exist = await this.tab.findOne({ mark });
    if (exist && exist._id.toString() !== id) {
      throw 20012;
    }

    await this.tab.findByIdAndUpdate(id, { name, mark });
  }

  /**
   * 查询话题标签
   * @param condition 话题标签查询条件
   */
  public queryTab(condition) {
    return this.tab.find(condition);
  }
}
