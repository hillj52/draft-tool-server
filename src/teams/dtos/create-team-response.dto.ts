import { Expose, Transform } from 'class-transformer';

export class CreateTeamResponseDto {
  @Expose() id: string;
  @Expose() name: string;
  @Expose() owner: string;
  @Expose()
  @Transform(() => process.env.TEAM_MAX_BUDGET)
  money: number;
}
