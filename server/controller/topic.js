const formidable = require('formidable');
const BaseComponent = require('../prototype/BaseComponent');
const TopicModel = require('../models/topic');
const UserModel = require('../models/user');
const ReplyModel = require('../models/reply');
const BehaviorModel = require('../models/behavior');

class Topic extends BaseComponent {
  constructor() {
    super();
    this.createTopic = this.createTopic.bind(this);
    this.starOrUnStar = this.starOrUnStar.bind(this);
    this.collectOrUnCollect = this.collectOrUnCollect.bind(this);
  }

  // 创建话题
  createTopic(req, res) {
    const form = new formidable.IncomingForm();
    form.parse(req, async (err, fields) => {
      if (err) {
        throw new Error(err);
      }

      const { id } = req.session.user;
      const { tab, title, content } = fields;

      try {
        if (!tab) {
          throw new Error('话题所属标签不能为空');
        } else if (!title) {
          throw new Error('话题标题不能为空');
        } else if (!content) {
          throw new Error('话题内容不能为空');
        }
      } catch(err) {
        return res.send({
          status: 0,
          type: 'ERROR_PARAMS_OF_CREATE_TOPIC',
          message: err.message
        });
      }

      const _topic = {
        ...fields,
        author_id: id,
      };

      const topic = await TopicModel.create(_topic);

      await this.generateBehavior('create', id, topic.id);

      const currentUser = await UserModel.findById(id);
      currentUser.score += 1;
      currentUser.topic_count += 1;
      await currentUser.save();

      return res.send({
        status: 1
      });
    });
  }

  // 删除话题
  async deleteTopic(req, res) {
    const { tid } = req.params;
    const { id } = req.session.user;

    const currentTopic = await TopicModel.findById(tid);

    if (!currentTopic) {
      return res.send({
        status: 0,
        type: 'ERROR_ID_IS_INVALID',
        message: '无效的ID'
      });
    }

    if (!currentTopic.author_id.equals(id)) {
      return res.send({
        status: 0,
        type: 'ERROR_IS_NOT_AUTHOR',
        message: '不能删除别人的话题'
      });
    }

    await TopicModel.findByIdAndUpdate(tid, { delete: true });
    return res.send({
      status: 1
    });
  }

  // 编辑话题
  editTopic(req, res) {
    const form = new formidable.IncomingForm();
    form.parse(req, async (err, fields) => {
      if (err) {
        throw new Error(err);
      }

      const { tid } = req.params;
      const { id } = req.session.user;

      const currentTopic = await TopicModel.findById(tid);

      if (!currentTopic) {
        return res.send({
          status: 0,
          type: 'ERROR_ID_IS_INVALID',
          message: '无效的ID'
        });
      }

      if (!currentTopic.author_id.equals(id)) {
        return res.send({
          status: 0,
          type: 'ERROR_IS_NOT_AUTHOR',
          message: '不能编辑别人的话题'
        });
      }

      const { tab, title, content } = fields;

      const topicInfo = {
        tab: tab || currentTopic.tab,
        title: title || currentTopic.title,
        content: content || currentTopic.content
      };

      await TopicModel.findByIdAndUpdate(tid, topicInfo);

      return res.send({
        status: 1
      });
    });
  }

  // 获取列表
  async getTopicList(req, res) {
    const tab = req.query.tab || 'all';
    const page = parseInt(req.query.page) || 1;
    const size = parseInt(req.query.size) || 10;

    let query = {
      lock: false,
      delete: false
    };

    if (!tab || tab === 'all') {
      query = {};
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

    const topicCount = await TopicModel.count(query);
    const topicList = await TopicModel.find(query, '-lock -delete', options);

    const promiseAuthor = await Promise.all(topicList.map(item => {
      return new Promise(resolve => {
        resolve(UserModel.findById(item.author_id, 'id nickname avatar'));
      });
    }));

    const promiseLastReply = await Promise.all(topicList.map(item => {
      return new Promise(resolve => {
        resolve(UserModel.findById(item.last_reply, 'id nickname avatar'));
      });
    }));

    const result = topicList.map((item, i) => {
      return {
        ...item.toObject({ virtuals: true }),
        author: promiseAuthor[i],
        last_reply_author: promiseLastReply[i],
        last_reply_at_ago: item.last_reply_at_ago()
      };
    });

    return res.send({
      status: 1,
      data: {
        topics: result,
        currentPage: page,
        total: topicCount,
        totalPage: Math.ceil(topicCount / size),
        tab,
        size
      },
    });
  }

  // 搜索话题
  async searchTopic(req, res) {
    const title = req.query.title || '';
    const page = parseInt(req.query.page) || 1;
    const size = parseInt(req.query.size) || 10;

    const query = {
      title: { $regex: title },
      lock: false,
      delete: false
    };

    const options = {
      skip: (page - 1) * size,
      limit: size,
      sort: '-top -last_reply_at'
    };

    const topicCount = await TopicModel.count(query);
    const topicList = await TopicModel.find(query, '-lock -delete', options);

    const promises = await Promise.all(topicList.map(item => {
      return new Promise(resolve => {
        resolve(UserModel.findById(item.author_id, 'nickname avatar'));
      });
    }));

    const result = topicList.map((item, i) => {
      return { ...item.toObject({ virtuals: true }), author: promises[i] };
    });

    return res.send({
      status: 1,
      data: {
        topics: result,
        currentPage: page,
        total: topicCount,
        totalPage: Math.ceil(topicCount / size),
        size
      },
    });
  }

  // 获取无人回复话题
  async getNoReplyTopic(req, res) {
    const query = {
      lock: false,
      delete: false,
      reply_count: 0
    };

    const options = {
      limit: 10,
      sort: '-top -last_reply_at'
    };

    const topicList = await TopicModel.find(query, 'id title', options);

    return res.send({
      status: 1,
      data: topicList
    });
  }

  // 获取话题详情
  async getTopicById(req, res) {
    const { tid } = req.params;
    const { user } = req.session;

    let currentTopic = await TopicModel.findById(tid);

    if (!currentTopic) {
      return res.send({
        status: 0,
        type: 'ERROR_ID_IS_INVALID',
        message: '无效的ID'
      });
    }

    currentTopic.visit_count += 1;
    currentTopic = await currentTopic.save();

    const author = await UserModel.findById(currentTopic.author_id, 'id nickname avatar location signature score');
    const replyList = await ReplyModel.find({ topic_id: currentTopic.id });

    const promises = await Promise.all(replyList.map(item => {
      return new Promise(resolve => {
        resolve(UserModel.findById(item.author_id, 'id nickname avatar'));
      });
    }));

    let starBehavior;
    let collectBehavior;

    if (user && user.id) {
      starBehavior = await BehaviorModel.findOne({ action: 'star', author_id: user.id, target_id: currentTopic.id });
      collectBehavior = await BehaviorModel.findOne({ action: 'collect', author_id: user.id, target_id: currentTopic.id });
    }

    const star = (starBehavior && !starBehavior.is_un) || false;
    const collect = (collectBehavior && !collectBehavior.is_un) || false;

    const replies = replyList.map((item, i) => {
      return {
        ...item.toObject({ virtuals: true }),
        author: promises[i],
        create_at_ago: item.create_at_ago()
      };
    });

    return res.send({
      status: 1,
      data: { ...currentTopic.toObject({ virtuals: true }), author, replies, star, collect }
    });
  }

  // 喜欢或者取消喜欢话题
  async starOrUnStar(req, res) {
    const { tid } = req.params;
    const { id } = req.session.user;

    const currentTopic = await TopicModel.findById(tid);

    if (!currentTopic) {
      return res.send({
        status: 0,
        type: 'ERROR_ID_IS_INVALID',
        message: '无效的ID'
      });
    }

    const currentAuhtor = await UserModel.findById(currentTopic.author_id);

    if (currentTopic.author_id.equals(id)) {
      return res.send({
        status: 0,
        type: 'ERROR_NOT_STAR_YOURS',
        message: '不能喜欢自己的话题哟'
      });
    }

    const behavior = await this.generateBehavior('star', id, tid);

    if (behavior.is_un) {
      currentTopic.star_count -= 1;
      await currentTopic.save();
      currentAuhtor.star_count -= 1;
      currentAuhtor.score -= 10;
      await currentAuhtor.save();
    } else {
      currentTopic.star_count += 1;
      currentTopic.save();
      currentAuhtor.star_count += 1;
      currentAuhtor.score += 10;
      await currentAuhtor.save();
      await this.sendStarNotice(id, currentTopic.author_id, currentTopic.id);
    }

    return res.send({
      status: 1,
      action: behavior.actualAction
    });
  }

  // 收藏或者取消收藏话题
  async collectOrUnCollect(req, res) {
    const { tid } = req.params;
    const { id } = req.session.user;

    const currentTopic = await TopicModel.findById(tid);

    if (!currentTopic) {
      return res.send({
        status: 0,
        type: 'ERROR_ID_IS_INVALID',
        message: '无效的ID'
      });
    }

    const currentAuthor = await UserModel.findById(currentTopic.author_id);

    if (currentTopic.author_id.equals(id)) {
      return res.send({
        status: 0,
        type: 'ERROR_NOT_COLLECT_YOURS',
        message: '不能收藏自己的话题哟'
      });
    }

    const behavior = await this.generateBehavior('collect', id, tid);

    if (behavior.is_un) {
      currentTopic.collect_count -= 1;
      currentTopic.save();
      currentAuthor.collect_count -= 1;
      currentAuthor.score -= 3;
      currentAuthor.save();
    } else {
      currentTopic.collect_count += 1;
      currentTopic.save();
      currentAuthor.collect_count += 1;
      currentAuthor.score += 3;
      await currentAuthor.save();
      await this.sendCollectNotice(id, currentTopic.author_id, currentTopic.id);
    }

    return res.send({
      status: 1,
      action: behavior.actualAction
    });
  }
}

module.exports = new Topic();
