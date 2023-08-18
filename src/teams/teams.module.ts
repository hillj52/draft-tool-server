import { Module } from '@nestjs/common';
import { TeamsController } from './teams.controller';
import { TeamsService } from './teams.service';
import { PrismaModule } from 'src/prisma.module';

@Module({
  imports: [PrismaModule],
  exports: [TeamsService],
  controllers: [TeamsController],
  providers: [TeamsService],
})
export class TeamsModule {}
