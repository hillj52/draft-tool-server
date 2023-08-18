import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { Player, Prisma } from '@prisma/client';
import { RosterPosition } from 'src/players/enum/roster-position.enum';

export interface Roster {
  qb?: Player;
  wr1?: Player;
  wr2?: Player;
  rb1?: Player;
  rb2?: Player;
  te?: Player;
  flex?: Player;
  op?: Player;
  k?: Player;
  dst?: Player;
  bench: Player[];
}

export const teamWithDraftedPlayers =
  Prisma.validator<Prisma.TeamDefaultArgs>()({
    include: { drafted: { include: { player: true } } },
  });

export type TeamWithDraftedPlayers = Prisma.TeamGetPayload<
  typeof teamWithDraftedPlayers
>;

@Injectable()
export class TeamsService {
  constructor(private prisma: PrismaService) {}

  createTeam(owner: string, name: string) {
    return this.prisma.team.create({ data: { owner, name } });
  }

  async getTeams() {
    const teams = await this.prisma.team.findMany({
      include: { drafted: { include: { player: true } } },
    });
    return teams.map((team) => ({
      ...team,
      ...this.createRoster(team),
    }));
  }

  async getTeam(id: string) {
    if (!id) {
      return null;
    }

    const team = await this.prisma.team.findFirst({
      where: { id },
      include: { drafted: { include: { player: true } } },
    });
    return {
      ...team,
      ...this.createRoster(team),
    };
  }

  updateTeam() {
    return 'Not Yet Implemented!';
  }

  private createRoster(team: TeamWithDraftedPlayers) {
    const roster = {
      ...team.drafted.reduce(
        (acc, record) => {
          if (record.rosterPosition === RosterPosition.BENCH) {
            acc.bench.push(record.player);
          } else {
            acc[record.rosterPosition as RosterPosition] = record.player;
          }
          return acc;
        },
        { bench: [] },
      ),
    };
    const money = team.drafted.reduce((acc, { price }) => acc - price, 300);
    return { ...roster, money };
  }
}
