import { Expose, plainToInstance, Transform } from 'class-transformer';
import { PlayerDto } from 'src/players/dtos/player.dto';
import { ShowTeamDto } from 'src/teams/dtos/show-team.dto';

export class DraftPlayerResponseDto {
  @Expose()
  @Transform(({ obj }) =>
    plainToInstance(PlayerDto, obj.player, { excludeExtraneousValues: true }),
  )
  player: PlayerDto;

  @Expose()
  @Transform(({ obj }) =>
    plainToInstance(ShowTeamDto, obj.team, { excludeExtraneousValues: true }),
  )
  team: ShowTeamDto;
}
