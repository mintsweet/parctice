import { Application } from 'egg';
import { Model, Document } from 'mongoose';

export interface UserModel extends Document {
  email: string;
  password: string;

  nickname: string;
  avatar: string;
  location: string;
  signature: string;

  score: number;

  is_star: boolean;
  status: 'normal' | 'delete' | 'disabled';
}

export default (app: Application): Model<UserModel> => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;

  const UserModel = new Schema(
    {
      email: { type: String, required: true, unique: true },
      password: { type: String, required: true },

      nickname: { type: String, required: true },
      avatar: { type: String, default: '' },
      location: { type: String, default: '' },
      signature: { type: String, default: '' },

      score: { type: Number, default: 0 },

      is_star: { type: Boolean, default: false },
      status: { type: String, default: 'normal' },
    },
    {
      usePushEach: true,
      timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    },
  );

  return mongoose.model('user', UserModel, 'user');
};
