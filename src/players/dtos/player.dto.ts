import { Expose } from 'class-transformer';

export class PlayerDto {
  @Expose() id: string;
  @Expose() overallRank: number;
  @Expose() tier: number;
  @Expose() name: string;
  @Expose() team: string;
  @Expose() position: string;
  @Expose() positionalRank: number;
  @Expose() strengthOfSchedule: string;
  @Expose() pointsAboveProjection: string;
  @Expose() gamesAboveProjection: string;
  @Expose() byeWeek: number;
  @Expose() value: number;
  @Expose() price: number;
  @Expose() drafted: boolean;
}
