import { Body, Controller, Get, Put } from '@nestjs/common';
import type { Setting } from '@prisma/client';
import { ApiValidationPipe } from 'src/common/pipes/api-validation.pipe';
import { PublicApi } from 'src/topics/auth/decorators/public-api.decorator';
import { Roles } from 'src/topics/auth/decorators/roles.decorator';
import { UpdateSettingInputDto } from 'src/topics/setting/dto/setting.dto';
import { SettingService } from 'src/topics/setting/setting.service';
import { UserRoles } from 'src/topics/user/role.enum';

@Controller('api/settings')
export class SettingController {
  constructor(private readonly settingService: SettingService) {}

  @Get('')
  @PublicApi()
  public async getUsers(): Promise<Setting> {
    return this.settingService.fetchSetting();
  }

  @Put('')
  @Roles(UserRoles.ADMIN)
  public async updateUser(@Body(new ApiValidationPipe()) requestBody: UpdateSettingInputDto): Promise<Setting> {
    return this.settingService.updateSetting(requestBody);
  }
}
