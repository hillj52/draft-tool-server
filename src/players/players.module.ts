import { Module } from '@nestjs/common';
import { PlayersController } from './players.controller';
import { PlayersService } from './players.service';
import { PrismaModule } from 'src/prisma.module';

@Module({
  imports: [PrismaModule],
  exports: [PlayersService],
  controllers: [PlayersController],
  providers: [PlayersService],
})
export class PlayersModule {}
