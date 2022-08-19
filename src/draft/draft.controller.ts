import { Body, Controller, Post } from '@nestjs/common';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { DraftService } from './draft.service';
import { DraftPlayerResponseDto } from './dtos/draft-player-response.dto';
import { DraftPlayerDto } from './dtos/draft-player.dto';
import { UndraftPlayerDto } from './dtos/undraft-player.dto';

@Controller('draft')
export class DraftController {
  constructor(private draftService: DraftService) {}

  @Post('/')
  @Serialize(DraftPlayerResponseDto)
  async draftPlayer(
    @Body() { playerId, teamId, price, position }: DraftPlayerDto,
  ) {
    const response = await this.draftService.draftPlayer(
      playerId,
      teamId,
      price,
      position,
    );
    return response;
  }

  @Post('/undraft')
  @Serialize(DraftPlayerResponseDto)
  async undraftPlayer(
    @Body() { playerId, teamId, position }: UndraftPlayerDto,
  ) {
    console.log('Undraft');
    const response = await this.draftService.undraftPlayer(
      playerId,
      teamId,
      position,
    );
    return response;
  }
}
