import { Module } from '@nestjs/common';
import { PlayersModule } from 'src/players/players.module';
import { TeamsModule } from 'src/teams/teams.module';
import { DraftController } from './draft.controller';
import { DraftService } from './draft.service';
import { PrismaModule } from 'src/prisma.module';

@Module({
  controllers: [DraftController],
  imports: [PlayersModule, TeamsModule, PrismaModule],
  providers: [DraftService],
})
export class DraftModule {}
