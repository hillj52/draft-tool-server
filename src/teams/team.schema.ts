import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Player, PlayerDocument } from 'src/players/player.schema';
import { MONGO_VIRTUALS_SCHEMA } from 'src/mongo';

export type TeamDocument = Team & mongoose.Document;

@Schema(MONGO_VIRTUALS_SCHEMA)
export class Team {
  @Prop() name: string;
  @Prop() owner: string;
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: () => Player })
  qb?: PlayerDocument;
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: () => Player })
  rb1?: PlayerDocument;
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: () => Player })
  rb2?: PlayerDocument;
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: () => Player })
  wr1?: PlayerDocument;
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: () => Player })
  wr2?: PlayerDocument;
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: () => Player })
  flex?: PlayerDocument;
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: () => Player })
  op?: PlayerDocument;
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: () => Player })
  te?: PlayerDocument;
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: () => Player })
  k?: PlayerDocument;
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: () => Player })
  dst?: PlayerDocument;
  @Prop({ type: [mongoose.Schema.Types.ObjectId], ref: () => Player })
  bench?: PlayerDocument[];
}

export const TeamSchema = SchemaFactory.createForClass(Team);

TeamSchema.pre('find', function (next) {
  this.populate('qb rb1 rb2 wr1 wr2 flex op te k dst bench');
  next();
});

TeamSchema.virtual('money').get(function () {
  let money = +process.env.TEAM_MAX_BUDGET;
  if (this.qb) {
    money -= this.qb.price;
  }
  if (this.rb1) {
    money -= this.rb1.price;
  }
  if (this.rb2) {
    money -= this.rb2.price;
  }
  if (this.wr1) {
    money -= this.wr1.price;
  }
  if (this.wr2) {
    money -= this.wr2.price;
  }
  if (this.flex) {
    money -= this.flex.price;
  }
  if (this.op) {
    money -= this.op.price;
  }
  if (this.te) {
    money -= this.te.price;
  }
  if (this.k) {
    money -= this.k.price;
  }
  if (this.dst) {
    money -= this.dst.price;
  }
  money -= this.bench.reduce((acc, { price }) => (acc += price), 0);
  return money;
});
