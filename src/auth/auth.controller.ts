import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { User } from 'src/decorators/user.decorator';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { UserDto } from './dtos/user.dto';
import { LocalAuthGuard } from './local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  @Serialize(UserDto)
  async signup(@Body() { email, password }: CreateUserDto) {
    const user = await this.authService.signup(email, password);
    return this.authService.login(user);
  }

  @Post('signin')
  @Serialize(UserDto)
  @UseGuards(LocalAuthGuard)
  async signin(@User() user: UserDto) {
    return this.authService.login(user);
  }
}
