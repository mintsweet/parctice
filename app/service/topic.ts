import { Service } from 'egg';
import { Model, Types } from 'mongoose';
import { TopicTabModel } from '@/model/topic/tab';
import { TopicModel } from '@/model/topic';
import { UserModel } from '@/model/user';
import { ActivityModel } from '@/model/user/activity';

export default class TopicService extends Service {
  private tab: Model<TopicTabModel>;
  private topic: Model<TopicModel>;
  private user: Model<UserModel>;
  private activity: Model<ActivityModel>;

  constructor(ctx) {
    super(ctx);
    this.tab = ctx.model.Topic.Tab;
    this.topic = ctx.model.Topic.Index;
    this.user = ctx.model.User.Index;
    this.activity = ctx.model.User.Activity;
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

  /**
   * 创建话题
   * @param title 话题标题
   * @param content 话题内容
   * @param tab_id 话题标签ID
   * @param author_id 话题作者ID
   */
  public async createTopic(title, content, tab_id, author_id) {
    await this.topic.create({ title, content, tab_id, author_id });
    await this.user.findByIdAndUpdate(author_id, {
      $inc: { score: 1 },
    });
  }

  /**
   * 删除话题
   * @param id 话题ID
   * @param author_id 话题作者ID
   */
  public async deleteTopic(id, author_id) {
    const topic = await this.topic.findByIdAndUpdate(id, { status: 'delete' });

    if (!topic) {
      throw 20017;
    }

    if (topic.author_id.toString() !== author_id) {
      throw 20018;
    }

    await this.user.findByIdAndUpdate(topic.author_id, {
      $inc: { score: -1 },
    });
  }

  /**
   * 编辑话题
   * @param id 话题ID
   * @param updated 话题内容
   * @param author_id 话题作者ID
   */
  public async updateTopic(id, updated, author_id) {
    const topic = await this.topic.findById(id);

    if (!topic) {
      throw 20017;
    }

    if (topic.author_id.toString() !== author_id) {
      throw 20019;
    }

    await this.topic.findByIdAndUpdate(id, updated);
  }

  /**
   * 获取话题详情
   * @param id 话题ID
   */
  public async getTopicDetail(id) {
    const [result] = await this.topic
      .aggregate([])
      .match({
        _id: Types.ObjectId(id),
      })
      .lookup({
        from: 'topic_tab',
        localField: 'tab_id',
        foreignField: '_id',
        as: 'tab',
      })
      .unwind({
        path: '$tab',
        preserveNullAndEmptyArrays: true,
      })
      .lookup({
        from: 'user',
        localField: 'author_id',
        foreignField: '_id',
        as: 'author',
      })
      .unwind({
        path: '$author',
        preserveNullAndEmptyArrays: true,
      })
      .project({
        title: 1,
        content: 1,
        tab: '$tab.name',
        created_at: 1,
        author: 1,
      })
      .project({
        'author.password': 0,
        'author.status': 0,
        'author.created_at': 0,
        'author.updated_at': 0,
        'author.__v': 0,
      });

    if (!result) {
      throw 20017;
    }

    await this.topic.findByIdAndUpdate(id, {
      $inc: { visit_count: 1 },
    });

    return result;
  }

  /**
   * 查询话题
   * @param page 页码
   * @param size 页数
   * @param condition 查询条件
   */
  public async queryTopic(page, size, condition) {
    const [result] = await this.topic
      .aggregate([])
      .match({
        ...condition,
        status: 'normal',
      })
      .lookup({
        from: 'topic_tab',
        localField: 'tab_id',
        foreignField: '_id',
        as: 'tab',
      })
      .unwind({
        path: '$tab',
        preserveNullAndEmptyArrays: true,
      })
      .lookup({
        from: 'user',
        localField: 'author_id',
        foreignField: '_id',
        as: 'author',
      })
      .unwind({
        path: '$author',
        preserveNullAndEmptyArrays: true,
      })
      .project({
        title: 1,
        tab_name: '$tab.name',
        author_name: '$author.nickname',
        author_avatar: '$author.avatar',
        created_at: 1,
      })
      .sort({
        created_at: -1,
      })
      .facet({
        list: [{ $skip: (page - 1) * size }, { $limit: size }],
        total: [{ $count: 'count' }],
      });

    return { list: result.list, total: result.total[0]?.count || 0 };
  }

  /**
   * 喜欢或者取消喜欢话题
   * @param tid 话题ID
   * @param aid 登录用户ID
   */
  public async likeOrCancel(tid, aid) {
    const topic = await this.topic.findById(tid);

    if (!topic) {
      throw 20017;
    }

    if (topic.author_id === aid) {
      throw 20020;
    }

    const activity = await this.activity.findOneAndUpdate(
      {
        type: 'liked',
        author_id: aid,
        target_id: tid,
      },
      {},
      { new: true, upsert: true },
    );

    if (activity?.is_cancel) {
      await Promise.all([
        this.topic.findByIdAndUpdate(tid, {
          $inc: { like_count: 1 },
        }),
        this.user.findByIdAndUpdate(aid, {
          $inc: { score: 10 },
        }),
        this.activity.findOneAndUpdate(
          {
            type: 'liked',
            author_id: aid,
            target_id: tid,
          },
          { is_cancel: false },
        ),
      ]);
    } else {
      await Promise.all([
        this.topic.findByIdAndUpdate(tid, {
          $inc: { like_count: -1 },
        }),
        this.user.findByIdAndUpdate(aid, {
          $inc: { score: -10 },
        }),
        this.activity.findOneAndUpdate(
          {
            type: 'liked',
            author_id: aid,
            target_id: tid,
          },
          { is_cancel: true },
        ),
      ]);
    }

    return activity?.is_cancel ? 'like' : 'like_cancel';
  }

  /**
   * 收藏或者取消收藏话题
   * @param tid 话题ID
   * @param aid 登录用户ID
   */
  public async collectOrCancel(tid, aid) {
    const topic = await this.topic.findById(tid);

    if (!topic) {
      throw 20017;
    }

    if (topic.author_id === aid) {
      throw 20021;
    }

    const activity = await this.activity.findOneAndUpdate(
      {
        type: 'collected',
        author_id: aid,
        target_id: tid,
      },
      {},
      { new: true, upsert: true },
    );

    if (activity?.is_cancel) {
      await Promise.all([
        this.topic.findByIdAndUpdate(tid, {
          $inc: { collect_count: 1 },
        }),
        this.user.findByIdAndUpdate(aid, {
          $inc: { score: 3 },
        }),
        this.activity.findOneAndUpdate(
          {
            type: 'collected',
            author_id: aid,
            target_id: tid,
          },
          { is_cancel: false },
        ),
      ]);
    } else {
      await Promise.all([
        this.topic.findByIdAndUpdate(tid, {
          $inc: { collect_count: -1 },
        }),
        this.user.findByIdAndUpdate(aid, {
          $inc: { score: -3 },
        }),
        this.activity.findOneAndUpdate(
          {
            type: 'collected',
            author_id: aid,
            target_id: tid,
          },
          { is_cancel: true },
        ),
      ]);
    }

    return activity?.is_cancel ? 'collect' : 'collect_cancel';
  }
}
