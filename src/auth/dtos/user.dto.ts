import { Expose } from 'class-transformer';

export class UserDto {
  @Expose() email: string;
  @Expose() access_token: string;
}
