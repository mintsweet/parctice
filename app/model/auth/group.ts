import { Application } from 'egg';
import { Model, Document } from 'mongoose';

export interface AuthGroupSchema extends Document {
  name: string;
  remark: string;
  permissions: [string];
  modifiable: boolean;
}

export default (app: Application): Model<AuthGroupSchema> => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;

  const AuthGroupSchema = new Schema(
    {
      name: { type: String, required: true, unique: true },
      remark: { type: String, default: '' },
      permissions: { type: Array, default: [] },
      modifiable: { type: Boolean, default: true },
    },
    { timestamps: true },
  );

  return mongoose.model('auth_group', AuthGroupSchema);
};
