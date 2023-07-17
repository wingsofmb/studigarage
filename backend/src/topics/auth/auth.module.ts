import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { env } from 'process';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from 'src/topics/auth/guards/auth.guard';
import { RolesGuard } from 'src/topics/auth/guards/roles.guard';
import { PasswordService } from 'src/topics/auth/password.service';
import { PrismaService } from 'src/prisma.service';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: env.JWT_SECRET,
      signOptions: { expiresIn: env.JWT_EXPIRES_IN },
    }),
  ],
  controllers: [AuthController],
  providers: [
    PrismaService,
    AuthService,
    PasswordService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AuthModule {}
