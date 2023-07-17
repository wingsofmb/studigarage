import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { SettingController } from 'src/topics/setting/setting.controller';
import { SettingService } from 'src/topics/setting/setting.service';

@Module({
  controllers: [SettingController],
  providers: [SettingService, PrismaService],
  exports: [SettingService],
})
export class SettingModule {}
