import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { PasswordService } from 'src/topics/auth/password.service';
import { UserController } from 'src/topics/user/user.controller';
import { UserService } from 'src/topics/user/user.service';

@Module({
  controllers: [UserController],
  providers: [UserService, PrismaService, PasswordService],
  exports: [UserService],
})
export class UserModule {}
