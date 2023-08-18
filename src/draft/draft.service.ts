import { Injectable, NotFoundException } from '@nestjs/common';
import { RosterPosition } from 'src/players/enum/roster-position.enum';
import { PlayersService } from 'src/players/players.service';
import { PrismaService } from 'src/prisma.service';
import { TeamsService } from 'src/teams/teams.service';

@Injectable()
export class DraftService {
  constructor(
    private teamsService: TeamsService,
    private playersService: PlayersService,
    private prisma: PrismaService,
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

    // Need logic to draft player with prisma relations
    const result = this.prisma.$transaction(async (tx) => {
      const draftRecord = await tx.draft.create({
        data: {
          price,
          rosterPosition: position,
          player: {
            connect: {
              id: playerId,
            },
          },
          team: {
            connect: {
              id: teamId,
            },
          },
        },
      });

      const player = await tx.player.update({
        where: { id: playerId },
        data: { drafted: true, price },
      });

      return { draftRecord, player };
    });

    return result;
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

    // Need logic to undraft player with prisma relations
    const result = this.prisma.$transaction(async (tx) => {
      const draftRecord = await tx.draft.findUniqueOrThrow({
        where: { playerId, teamId, rosterPosition: position },
      });

      await tx.draft.delete({
        where: { teamId, playerId, rosterPosition: position },
      });

      const player = await tx.player.update({
        where: { id: playerId },
        data: { drafted: false, price: 0 },
      });

      return { draftRecord, player };
    });

    return result;
  }
}
