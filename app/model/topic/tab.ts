import { Application } from 'egg';
import { Model, Document } from 'mongoose';

export interface TopicTabModel extends Document {
  name: string;
  mark: string;
  status: 'normal';
}

export default (app: Application): Model<TopicTabModel> => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;

  const TopicTabSchema = new Schema(
    {
      name: { type: String, required: true, unique: true },
      mark: { type: String, required: true, unique: true },
      status: { type: String, default: 'normal' },
    },
    {
      usePushEach: true,
      timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    },
  );

  return mongoose.model('topic_tab', TopicTabSchema, 'topic_tab');
};
