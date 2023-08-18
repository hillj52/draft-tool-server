import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import type { User } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  create(username: string, passwordHash: string): Promise<User> {
    return this.prisma.user.create({ data: { username, passwordHash } });
  }

  findOne(id: string): Promise<User> {
    return this.prisma.user.findUnique({ where: { id } });
  }

  find(username: string): Promise<User> {
    return this.prisma.user.findUnique({ where: { username } });
  }
}
