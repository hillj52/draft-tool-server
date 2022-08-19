import { Module } from '@nestjs/common';
import { PlayersModule } from 'src/players/players.module';
import { TeamsModule } from 'src/teams/teams.module';
import { DraftController } from './draft.controller';
import { DraftService } from './draft.service';

@Module({
  controllers: [DraftController],
  imports: [PlayersModule, TeamsModule],
  providers: [DraftService],
})
export class DraftModule {}
