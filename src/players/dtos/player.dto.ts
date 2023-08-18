import { Expose } from 'class-transformer';

export class PlayerDto {
  @Expose() id: string;
  @Expose() name: string;
  @Expose() team: string;
  @Expose() position: string;
  @Expose() byeWeek: number;
  @Expose() value: number;
  @Expose() price: number;
  @Expose() drafted: boolean;
  @Expose() projectedPoints: number;
}
