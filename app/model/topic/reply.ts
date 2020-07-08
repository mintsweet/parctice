import { Application } from 'egg';
import { Model, Document, Types } from 'mongoose';
import { TopicModel } from './index';
import { UserModel } from '../user';

export interface TopicReplyModel extends Document {
  content: string;
  topic_id: TopicModel['_id'];
  author_id: UserModel['_id'];
}

export default (app: Application): Model<TopicReplyModel> => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;

  const TopicReplySchema = new Schema(
    {
      content: { type: String, required: true },

      topic_id: { type: Types.ObjectId, required: true },
      author_id: { type: Types.ObjectId, required: true },
    },
    {
      usePushEach: true,
      timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    },
  );

  return mongoose.model('topic_reply', TopicReplySchema, 'topic_reply');
};
