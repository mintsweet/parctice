const TopicProxy = require('../../proxy/topic');
const UserProxy = require('../../proxy/user');
const ActionProxy = require('../../proxy/action');
const ReplyProxy = require('../../proxy/reply');
const NoticeProxy = require('../../proxy/notice');
const config = require('../../config');

class Topic {
  // 创建话题
  async createTopic(ctx) {
    const { id } = ctx.state.user;
    const { tab, title, content } = ctx.request.body;

    try {
      if (!tab) {
        throw new Error('话题所属标签不能为空');
      } else if (!title) {
        throw new Error('话题标题不能为空');
      } else if (!content) {
        throw new Error('话题内容不能为空');
      }
    } catch(err) {
      ctx.throw(400, err.message);
    }

    // 创建话题
    const topic = await TopicProxy.create({
      tab,
      title,
      content,
      author_id: id
    });

    // 查询作者
    const author = await UserProxy.getById(id);

    // 积分累计
    author.score += 1;
    // 话题数量累计
    author.topic_count += 1;
    // 更新用户信息
    await author.save();

    // 创建行为
    await ActionProxy.create({
      type: 'create',
      author_id: author.id,
      target_id: topic.id
    });

    ctx.body = '';
  }

  // 删除话题
  async deleteTopic(ctx) {
    const { id } = ctx.state.user;
    const { tid } = ctx.params;

    const topic = await TopicProxy.getById(tid);

    if (!topic) {
      ctx.throw(404, '话题不存在');
    }

    if (!topic.author_id.equals(id)) {
      ctx.throw(403, '不能删除别人的话题');
    }

    // 改变为删除状态
    topic.delete = true;
    await topic.save();

    // 查询作者
    const author = await UserProxy.getById(topic.author_id);

    // 积分减去
    author.score -= 1;
    // 话题数量减少
    author.topic_count -= 1;
    // 更新用户信息
    await author.save();

    // 更新行为
    const conditions = {
      type: 'create',
      author_id: author.id,
      target_id: topic.id
    };

    const action = await ActionProxy.getOne(conditions);

    await ActionProxy.update(conditions, {
      ...action.toObject(),
      is_un: true
    });

    ctx.body = '';
  }

  // 编辑话题
  async updateTopic(ctx) {
    const { id } = ctx.state.user;
    const { tid } = ctx.params;

    const topic = await TopicProxy.getById(tid);

    if (!topic) {
      ctx.throw(404, '话题不存在');
    }

    if (!topic.author_id.equals(id)) {
      ctx.throw(403, '不能编辑别人的话题');
    }

    // 更新内容
    const {
      tab = topic.tab,
      title = topic.title,
      content = topic.content
    } = ctx.request.body;

    await TopicProxy.update({ _id: tid }, {
      ...topic.toObject(),
      tab,
      title,
      content
    });

    ctx.body = '';
  }

  // 获取列表
  async getTopicList(ctx) {
    const tab = ctx.query.tab || 'all';
    const page = parseInt(ctx.query.page) || 1;
    const size = parseInt(ctx.query.size) || 10;

    let query = {
      lock: false,
      delete: false
    };

    if (!tab || tab === 'all') {
      query = {
        lock: false,
        delete: false
      };
    } else if (tab === 'good') {
      query.good = true;
    } else {
      query.tab = tab;
    }

    const options = {
      skip: (page - 1) * size,
      limit: size,
      sort: '-top -last_reply_at'
    };

    const count = await TopicProxy.count(query);
    const topics = await TopicProxy.get(query, '-lock -delete', options);

    const promiseAuthor = await Promise.all(topics.map(item => {
      return new Promise(resolve => {
        resolve(UserProxy.getById(item.author_id, 'id nickname avatar'));
      });
    }));

    const promiseLastReply = await Promise.all(topics.map(item => {
      return new Promise(resolve => {
        resolve(UserProxy.getById(item.last_reply, 'id nickname avatar'));
      });
    }));

    const list = topics.map((item, i) => {
      return {
        ...item.toObject({
          virtuals: true
        }),
        author: promiseAuthor[i],
        last_reply_author: promiseLastReply[i],
        last_reply_at_ago: item.last_reply_at_ago()
      };
    });

    ctx.body = {
      topics: list,
      currentPage: page,
      total: count,
      totalPage: Math.ceil(count / size),
      currentTab: tab,
      tabs: config.tabs,
      size
    };
  }

  // 搜索话题
  async searchTopic(ctx) {
    const title = ctx.query.title || '';
    const page = parseInt(ctx.query.page) || 1;
    const size = parseInt(ctx.query.size) || 10;

    const query = {
      title: { $regex: title },
      lock: false,
      delete: false
    };

    const option = {
      skip: (page - 1) * size,
      limit: size,
      sort: '-top -last_reply_at'
    };

    const count = await TopicProxy.count(query);
    const topics = await TopicProxy.get(query, '-lock -delete', option);

    const promiseAuthor = await Promise.all(topics.map(item => {
      return new Promise(resolve => {
        resolve(UserProxy.getById(item.author_id, 'id nickname avatar'));
      });
    }));

    const promiseLastReply = await Promise.all(topics.map(item => {
      return new Promise(resolve => {
        resolve(UserProxy.getById(item.last_reply, 'id nickname avatar'));
      });
    }));

    const list = topics.map((item, i) => {
      return {
        ...item.toObject({
          virtuals: true
        }),
        author: promiseAuthor[i],
        last_reply_author: promiseLastReply[i],
        last_reply_at_ago: item.last_reply_at_ago()
      };
    });

    ctx.body = {
      topics: list,
      currentPage: page,
      total: count,
      totalPage: Math.ceil(count / size),
      size
    };
  }

  // 获取无人回复话题
  async getNoReplyTopic(ctx) {
    const count = parseInt(ctx.query.count) || 10;

    const query = {
      lock: false,
      delete: false,
      reply_count: 0
    };

    const options = {
      limit: count,
      sort: '-top -good'
    };

    const topics = await TopicProxy.get(query, 'id title', options);

    ctx.body = topics;
  }

  // 获取话题详情
  async getTopicById(ctx) {
    const { tid } = ctx.params;

    const topic = await TopicProxy.getById(tid);

    if (!topic) {
      ctx.throw(404, '话题不存在');
    }

    // 访问计数
    topic.visit_count += 1;
    await topic.save();

    // 作者
    const author = await UserProxy.getById(topic.author_id, 'id nickname avatar location signature score');
    // 回复
    let replies = await ReplyProxy.get({ topic_id: topic.id });
    const reuslt = await Promise.all(replies.map(item => {
      return new Promise(resolve => {
        resolve(UserProxy.getById(item.author_id, 'id nickname avatar'));
      });
    }));

    replies = replies.map((item, i) => ({
      ...item.toObject(),
      author: reuslt[i],
      create_at_ago: item.create_at_ago()
    }));

    // 状态
    let like;
    let collect;

    const { user } = ctx.state;

    if (user) {
      like = await ActionProxy.getOne({
        type: 'like',
        author_id: user.id,
        target_id: topic.id
      });
      collect = await ActionProxy.getOne({
        type: 'collect',
        author_id: user.id,
        target_id: topic.id
      });
    }

    like = (like && !like.is_un) || false;
    collect = (collect && !collect.is_un) || false;

    ctx.body = {
      topic: topic.toObject({ virtuals: true }),
      author,
      replies,
      like,
      collect
    };
  }

  // 喜欢或者取消喜欢话题
  async likeOrUnLike(ctx) {
    const { id } = ctx.state.user;
    const { tid } = ctx.params;

    const topic = await TopicProxy.getById(tid);

    if (!topic) {
      ctx.throw(404, '话题不存在');
    }

    if (topic.author_id.equals(id)) {
      ctx.throw(403, '不能喜欢自己的话题哟');
    }

    const author = await UserProxy.getById(topic.author_id);

    const actionParam = {
      type: 'like',
      author_id: id,
      target_id: topic.id
    };

    let action;

    action = await ActionProxy.getOne(actionParam);

    if (action) {
      action.is_un = !action.is_un;
      await action.save();
    } else {
      action = await ActionProxy.create(actionParam);
    }

    if (action.is_un) {
      topic.like_count -= 1;
      await topic.save();
      author.like_count -= 1;
      author.score -= 10;
      await author.save();
    } else {
      topic.like_count += 1;
      await topic.save();
      author.like_count += 1;
      author.score += 10;
      await author.save();
      await NoticeProxy.create({
        type: 'like',
        author_id: id,
        target_id: topic.author_id,
        topic_id: topic.id
      });
    }

    ctx.body = action.toObject({ virtuals: true }).actualType;
  }

  // 收藏或者取消收藏话题
  async collectOrUnCollect(ctx) {
    const { id } = ctx.state.user;
    const { tid } = ctx.params;

    const topic = await TopicProxy.getById(tid);

    if (!topic) {
      ctx.throw(404, '话题不存在');
    }

    if (topic.author_id.equals(id)) {
      ctx.throw(403, '不能收藏自己的话题哟');
    }

    const author = await UserProxy.getById(topic.author_id);

    const actionParam = {
      type: 'collect',
      author_id: id,
      target_id: topic.id
    };

    let action;
    action = await ActionProxy.getOne(actionParam);

    if (action) {
      action.is_un = !action.is_un;
      await action.save();
    } else {
      action = await ActionProxy.create(actionParam);
    }

    if (action.is_un) {
      topic.collect_count -= 1;
      topic.save();
      author.collect_count -= 1;
      author.score -= 3;
      author.save();
    } else {
      topic.collect_count += 1;
      topic.save();
      author.collect_count += 1;
      author.score += 3;
      await author.save();
      await NoticeProxy.create({
        type: 'collect',
        author_id: id,
        target_id: topic.author_id,
        topic_id: topic.id
      });
    }

    ctx.body = action.toObject({ virtuals: true }).actualType;
  }
}

module.exports = new Topic();
