import { Model, Document } from 'mongoose';
import { Application } from 'egg';

export interface UserSchema extends Document {
  username: string;
  password: string;
}

export default (app: Application): Model<UserSchema> => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;

  const UserSchema = new Schema(
    {
      username: { type: String, required: true, unique: true },
      password: { type: String, required: true },
    },
    {
      usePushEach: true,
      timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' },
    },
  );

  return mongoose.model('user', UserSchema);
};
