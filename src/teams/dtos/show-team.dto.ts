import { Expose, plainToInstance, Transform } from 'class-transformer';
import { PlayerDto } from 'src/players/dtos/player.dto';

export class ShowTeamDto {
  @Expose() id: string;
  @Expose() owner: string;
  @Expose() name: string;

  @Expose()
  @Transform((value) =>
    plainToInstance(PlayerDto, value.obj.qb, { excludeExtraneousValues: true }),
  )
  qb: PlayerDto;

  @Expose()
  @Transform((value) =>
    plainToInstance(PlayerDto, value.obj.rb1, {
      excludeExtraneousValues: true,
    }),
  )
  rb1: PlayerDto;

  @Expose()
  @Transform((value) =>
    plainToInstance(PlayerDto, value.obj.rb2, {
      excludeExtraneousValues: true,
    }),
  )
  rb2: PlayerDto;

  @Expose()
  @Transform((value) =>
    plainToInstance(PlayerDto, value.obj.wr1, {
      excludeExtraneousValues: true,
    }),
  )
  wr1: PlayerDto;

  @Expose()
  @Transform((value) =>
    plainToInstance(PlayerDto, value.obj.wr2, {
      excludeExtraneousValues: true,
    }),
  )
  wr2: PlayerDto;

  @Expose()
  @Transform((value) =>
    plainToInstance(PlayerDto, value.obj.te, { excludeExtraneousValues: true }),
  )
  te: PlayerDto;

  @Expose()
  @Transform((value) =>
    plainToInstance(PlayerDto, value.obj.flex, {
      excludeExtraneousValues: true,
    }),
  )
  flex: PlayerDto;

  @Expose()
  @Transform((value) =>
    plainToInstance(PlayerDto, value.obj.op, { excludeExtraneousValues: true }),
  )
  op: PlayerDto;

  @Expose()
  @Transform((value) =>
    plainToInstance(PlayerDto, value.obj.k, { excludeExtraneousValues: true }),
  )
  k: PlayerDto;

  @Expose()
  @Transform((value) =>
    plainToInstance(PlayerDto, value.obj.dst, {
      excludeExtraneousValues: true,
    }),
  )
  dst: PlayerDto;

  @Expose()
  @Transform((value) =>
    value.obj.bench.map((player) =>
      plainToInstance(PlayerDto, player, { excludeExtraneousValues: true }),
    ),
  )
  bench: PlayerDto[];

  @Expose() money: number;
}
