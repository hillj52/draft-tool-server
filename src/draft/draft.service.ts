import { Injectable, NotFoundException } from '@nestjs/common';
import mongoose from 'mongoose';
import { RosterPosition } from 'src/players/enum/roster-position.enum';
import { PlayersService } from 'src/players/players.service';
import { TeamsService } from 'src/teams/teams.service';

@Injectable()
export class DraftService {
  constructor(
    private teamsService: TeamsService,
    private playersService: PlayersService,
  ) {}

  async draftPlayer(
    playerId: string,
    teamId: string,
    price: number,
    position: RosterPosition,
  ) {
    const team = await this.teamsService.getTeam(teamId);
    const player = await this.playersService.getPlayer(playerId);
    if (!team || !player) {
      throw new NotFoundException();
    }

    player.set({ drafted: true, price });
    await player.save();

    if (position === RosterPosition.BENCH) {
      if (team.bench) {
        team.set({ bench: [...team.bench, player] });
      } else {
        team.set({ bench: [player] });
      }
    } else {
      team.set({ [position]: player });
    }
    await team.save();
    await team.populate('qb rb1 rb2 wr1 wr2 te flex op k dst bench');

    return { team, player };
  }

  async undraftPlayer(
    playerId: string,
    teamId: string,
    position: RosterPosition,
  ) {
    const team = await this.teamsService.getTeam(teamId);
    const player = await this.playersService.getPlayer(playerId);
    if (!team || !player) {
      throw new NotFoundException();
    }

    player.set({ drafted: false, price: undefined });
    await player.save();

    if (position === RosterPosition.BENCH) {
      console.log(player.id);
      const bench = team.bench?.filter(
        ({ _id }) => _id.toString() !== player.id,
      );
      console.log(bench);
      team.set({ bench });
    } else {
      team.set({ [position]: undefined });
    }

    await team.save();
    await team.populate('qb rb1 rb2 wr1 wr2 te flex op k dst bench');

    return { team, player };
  }
}
