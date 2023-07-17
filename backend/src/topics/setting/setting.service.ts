import { Injectable } from '@nestjs/common';
import { Setting } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { UpdateSettingInputDto } from 'src/topics/setting/dto/setting.dto';

@Injectable()
export class SettingService {
  constructor(private readonly prismaService: PrismaService) {}

  public async fetchSetting(): Promise<Setting> {
    return this.prismaService.setting.findUniqueOrThrow({ where: { id: 1 } });
  }

  public async updateSetting(requestBody: UpdateSettingInputDto): Promise<Setting> {
    await this.prismaService.setting.findUniqueOrThrow({ where: { id: 1 } });
    return this.prismaService.setting.update({ where: { id: 1 }, data: requestBody });
  }
}
