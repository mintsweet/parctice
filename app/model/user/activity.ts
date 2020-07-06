import { Application } from 'egg';
import { Model, Document, Types } from 'mongoose';
import { UserModel } from './index';
import { TopicModel } from '../topic';

/*
 * 根据类型区分行为 type
 * 1. created 创建了
 * 2. liked 喜欢了
 * 3. collected 收藏了
 * 4. followed 关注了
 */

export interface ActivityModel extends Document {
  type: 'created' | 'liked' | 'collected' | 'followed';
  author_id: UserModel['_id'];
  target_id: TopicModel['_id'] | UserModel['_id'];
  is_cancel: boolean;
}

export default (app: Application): Model<ActivityModel> => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;

  const ActivityModel = new Schema(
    {
      type: { type: String, required: true },
      author_id: { type: Types.ObjectId, required: true }, // 发起者
      target_id: { type: Types.ObjectId, required: true }, // 命中者
      is_cancel: { type: Boolean, default: true }, // 行为反向
    },
    {
      usePushEach: true,
      timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    },
  );

  return mongoose.model('user_activity', ActivityModel, 'user_activity');
};
