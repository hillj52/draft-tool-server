import { Controller, Get } from '@nestjs/common';
import { SerializeArray } from 'src/interceptors/serialize-array.interceptor';
import { PlayerDto } from './dtos/player.dto';
import { PlayersService } from './players.service';

@Controller('players')
export class PlayersController {
  constructor(private playersService: PlayersService) {}

  @Get('/')
  @SerializeArray(PlayerDto)
  async getPlayers() {
    const players = await this.playersService.getPlayers();
    return players;
  }
}
