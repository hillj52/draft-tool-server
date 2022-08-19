import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { MONGO_ID_SCHEMA } from 'src/mongo';

export type UserDocument = User & mongoose.Document;

@Schema(MONGO_ID_SCHEMA)
export class User {
  @Prop() email: string;
  @Prop() password: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
