//src/auth/auth.module.ts
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { JwtService } from '@nestjs/jwt';
import { AccessTokenStrategy } from './strategies/accesstoken.strategy';
import { RefreshTokenStrategy } from './strategies/refreshtoken.strategy';
import { UsersService } from 'src/users/users.service';

@Module({
  imports: [
    PrismaModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtService, AccessTokenStrategy, RefreshTokenStrategy, UsersService],
})
export class AuthModule {}