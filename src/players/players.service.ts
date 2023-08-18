import { Injectable } from '@nestjs/common';
import { Player } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class PlayersService {
  constructor(private prisma: PrismaService) {}

  getPlayers() {
    return this.prisma.player.findMany({
      include: { passingStats: true, rushingStats: true, recievingStats: true },
    });
  }

  getPlayer(id: string) {
    if (!id) {
      return null;
    }
    return this.prisma.player.findUnique({ where: { id } });
  }

  updatePlayer(id: string, data: Partial<Player>) {
    return this.prisma.player.update({ where: { id }, data });
  }
}
