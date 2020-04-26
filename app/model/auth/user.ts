import { Application } from 'egg';
import { Model, Document } from 'mongoose';

export interface AuthUserSchema extends Document {
  username: string;
  password: string;
  role: string;
}

export default (app: Application): Model<AuthUserSchema> => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;

  const AuthUserSchema = new Schema(
    {
      username: { type: String, required: true, unique: true },
      password: { type: String, required: true },
      role: { type: Schema.Types.ObjectId, ref: 'auth_group', required: true },
    },
    {
      timestamps: true,
    },
  );

  return mongoose.model('auth_user', AuthUserSchema);
};
