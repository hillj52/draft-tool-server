import { Module, ValidationPipe } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_PIPE } from '@nestjs/core';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { DraftModule } from './draft/draft.module';
import { PlayersModule } from './players/players.module';
import { TeamsModule } from './teams/teams.module';
import { PrismaModule } from './prisma.module';

@Module({
  imports: [
    AuthModule,
    TeamsModule,
    PlayersModule,
    DraftModule,
    PrismaModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', `.env.${process.env.NODE_ENV || 'development'}`],
    }),
  ],
  controllers: [AppController],
  providers: [
    { provide: APP_PIPE, useValue: new ValidationPipe({ whitelist: true }) },
  ],
  exports: [],
})
export class AppModule {}
