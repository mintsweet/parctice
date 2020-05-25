import { Application } from 'egg';
import { Model, Document } from 'mongoose';

enum Type {
  number = 'number',
  boolean = 'boolean',
  string = 'string',
  array = 'array',
}

export interface DictSchema extends Document {
  key: string;
  tag: string;
  note: string;
  value: any;
  type: Type;
}

export default (app: Application): Model<DictSchema> => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;

  const DictSchema = new Schema(
    {
      key: {
        type: String,
        required: true,
        index: true,
        unique: true,
      },
      tag: { type: String },
      note: { type: String },
      value: {
        type: mongoose.Schema.Types.Mixed,
        required: true,
      },
      type: {
        type: String,
        enum: ['number', 'boolean', 'string', 'array'],
      },
    },
    {
      timestamps: true,
    },
  );

  return mongoose.model('dict', DictSchema, 'dict');
};
