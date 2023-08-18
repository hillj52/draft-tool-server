import { Body, Controller, Post } from '@nestjs/common';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { DraftService } from './draft.service';
import { DraftPlayerResponseDto } from './dtos/draft-player-response.dto';
import { DraftPlayerDto } from './dtos/draft-player.dto';
import { UndraftPlayerDto } from './dtos/undraft-player.dto';
import { TeamsService } from 'src/teams/teams.service';

@Controller('draft')
export class DraftController {
  constructor(
    private draftService: DraftService,
    private teamsService: TeamsService,
  ) {}

  @Post('/')
  @Serialize(DraftPlayerResponseDto)
  async draftPlayer(
    @Body() { playerId, teamId, price, position }: DraftPlayerDto,
  ) {
    const { player } = await this.draftService.draftPlayer(
      playerId,
      teamId,
      price,
      position,
    );
    const team = await this.teamsService.getTeam(teamId);
    return { team, player };
  }

  @Post('/undraft')
  @Serialize(DraftPlayerResponseDto)
  async undraftPlayer(
    @Body() { playerId, teamId, position }: UndraftPlayerDto,
  ) {
    console.log('Undraft');
    const { player } = await this.draftService.undraftPlayer(
      playerId,
      teamId,
      position,
    );
    const team = await this.teamsService.getTeam(teamId);
    return { team, player };
  }
}
