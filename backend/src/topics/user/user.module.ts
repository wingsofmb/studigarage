import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { UserController } from 'src/topics/user/user.controller';
import { UserService } from 'src/topics/user/user.service';

@Module({
  controllers: [UserController],
  providers: [UserService, PrismaService],
  exports: [UserService],
})
export class UserModule {}
