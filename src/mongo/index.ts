import { SchemaOptions } from '@nestjs/mongoose';

export const MONGO_ID_SCHEMA: SchemaOptions = {
  toJSON: {
    transform(doc, ret) {
      ret.id = ret._id;
      delete ret._id;
    },
  },
};

export const MONGO_VIRTUALS_SCHEMA: SchemaOptions = {
  toJSON: {
    virtuals: true,
    transform(doc, ret) {
      ret.id = ret._id;
      delete ret._id;
    },
  },
};
