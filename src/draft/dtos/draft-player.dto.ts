import { IsPositive, IsString } from 'class-validator';
import { RosterPosition } from 'src/players/enum/roster-position.enum';

export class DraftPlayerDto {
  @IsString() playerId: string;
  @IsString() teamId: string;
  @IsPositive() price: number;
  @IsString() position: RosterPosition;
}
