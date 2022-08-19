import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';
import { UsersService } from './users.service';

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signup(email: string, password: string) {
    const existingUser = await this.usersService.find(email);
    if (existingUser) {
      throw new BadRequestException('Email already in use');
    }
    const salt = randomBytes(16).toString('hex');

    const hash = await this.hashPassword(password, salt);
    const result = `${hash}.${salt}`;

    const user = await this.usersService.create(email, result);
    return user;
  }

  async signIn(email: string, password: string) {
    const user = await this.usersService.find(email);
    if (!user) {
      throw new NotFoundException('Email not in use');
    }

    const [storedHash, salt] = user.password.split('.');
    const hash = await this.hashPassword(password, salt);

    if (storedHash !== hash) {
      throw new BadRequestException('Invalid Email/Password');
    }

    return user;
  }

  async login(user: any) {
    //replace any with User { email, id } type
    return {
      email: user.email,
      access_token: this.jwtService.sign({ email: user.email, sub: user.id }),
    };
  }

  private async hashPassword(password: string, salt: string) {
    const pepper = process.env.PEPPER;
    const hash = (await scrypt(`${pepper}${password}`, salt, 32)) as Buffer;
    return hash.toString('hex');
  }
}
