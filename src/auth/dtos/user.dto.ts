import { Expose } from 'class-transformer';

export class UserDto {
  @Expose() username: string;
  @Expose() access_token: string;
}
