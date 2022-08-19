import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Team, TeamDocument } from './team.schema';

@Injectable()
export class TeamsService {
  constructor(@InjectModel(Team.name) private model: Model<TeamDocument>) {}

  createTeam(owner: string, name: string) {
    const team = new this.model({ owner, name });
    return team.save();
  }

  getTeams() {
    return this.model.find({}).exec();
  }

  getTeam(id: string) {
    if (!id) {
      return null;
    }
    return this.model.findById(id).exec();
  }

  updateTeam(id: string, attrs: Partial<TeamDocument>) {
    return this.model.findByIdAndUpdate(id, { ...attrs }).exec();
  }
}
