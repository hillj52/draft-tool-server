import { Controller, Get } from '@nestjs/common';
import { SerializeArray } from 'src/interceptors/serialize-array.interceptor';
import { PlayerDto } from './dtos/player.dto';
import { PlayerCsvService } from './player-csv.service';
import { PlayersService } from './players.service';

@Controller('players')
export class PlayersController {
  constructor(
    private playerCsvService: PlayerCsvService,
    private PlayersService: PlayersService,
  ) {}

  @Get('/')
  @SerializeArray(PlayerDto)
  async getPlayers() {
    const players = await this.PlayersService.getPlayers();
    return players;
  }

  @Get('/init')
  async initPlayers() {
    const players = await this.playerCsvService.createAllPlayers();
    console.log(players);
    return;
  }
}
