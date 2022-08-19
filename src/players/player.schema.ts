import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { MONGO_ID_SCHEMA } from 'src/mongo';

export type PlayerDocument = Player & mongoose.Document;

@Schema(MONGO_ID_SCHEMA)
export class Player {
  @Prop() overallRank: number;
  @Prop() tier: number;
  @Prop() name: string;
  @Prop() team: string;
  @Prop() position: string;
  @Prop() positionalRank: number;
  @Prop({ required: false }) strengthOfSchedule?: string;
  @Prop({ required: false }) pointsAboveProjection?: string;
  @Prop() gamesAboveProjection: string;
  @Prop() byeWeek: number;
  @Prop() value: number;
  @Prop({ required: false }) price?: number;
  @Prop() drafted: boolean;
}

export const PlayerSchema = SchemaFactory.createForClass(Player);
