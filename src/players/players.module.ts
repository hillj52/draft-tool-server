import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PlayerCsvService } from './player-csv.service';
import { Player, PlayerSchema } from './player.schema';
import { PlayersController } from './players.controller';
import { PlayersService } from './players.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Player.name, schema: PlayerSchema }]),
  ],
  exports: [PlayersService],
  controllers: [PlayersController],
  providers: [PlayersService, PlayerCsvService],
})
export class PlayersModule {}
