import { IsString } from 'class-validator';
import { RosterPosition } from 'src/players/enum/roster-position.enum';

export class UndraftPlayerDto {
  @IsString() playerId: string;
  @IsString() teamId: string;
  @IsString() position: RosterPosition;
}
