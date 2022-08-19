import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Player, PlayerDocument } from './player.schema';

interface CreatePlayerAttributes {
  name: string;
  team: string;
  tier: number;
  overallRank: number;
  positionalRank: number;
  byeWeek: number;
  value: number;
  position: string;
  strengthOfSchedule: string;
  pointsAboveProjection: string;
}

@Injectable()
export class PlayersService {
  constructor(@InjectModel(Player.name) private model: Model<PlayerDocument>) {}

  create(attributes: CreatePlayerAttributes): Promise<Player> {
    const player = new this.model({ ...attributes, drafted: false });
    return player.save();
  }

  getPlayers() {
    return this.model.find({}).exec();
  }

  getPlayer(id: string) {
    if (!id) {
      return null;
    }
    return this.model.findById(id).exec();
  }

  updatePlayer(id: string, attrs: Partial<PlayerDocument>) {
    return this.model.findByIdAndUpdate(id, { ...attrs }).exec();
  }
}
