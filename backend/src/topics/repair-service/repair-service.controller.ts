import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import type { RepairService } from '@prisma/client';
import { ApiValidationPipe } from 'src/common/pipes/api-validation.pipe';
import { PublicApi } from 'src/topics/auth/decorators/public-api.decorator';
import { Roles } from 'src/topics/auth/decorators/roles.decorator';
import { CreateRepairServiceInputDto } from 'src/topics/repair-service/dto/repair-services.dto';
import { RepairServiceService } from 'src/topics/repair-service/repair-service.service';
import { UserRoles } from 'src/topics/user/role.enum';

@Controller('api/repair-services')
export class RepairServiceController {
  constructor(private readonly repairServiceService: RepairServiceService) {}

  @Get('')
  @PublicApi()
  public async getRepairServices(): Promise<RepairService[]> {
    return this.repairServiceService.fetchRepairServices();
  }

  @Post('')
  @Roles(UserRoles.ADMIN)
  public async createRepairServices(@Body(new ApiValidationPipe()) requestBody: CreateRepairServiceInputDto): Promise<RepairService> {
    return this.repairServiceService.createRepairService(requestBody);
  }

  @Delete(':id')
  @Roles(UserRoles.ADMIN)
  async deleteRepairServices(@Param('id', ParseIntPipe) id: string): Promise<RepairService> {
    return this.repairServiceService.deleteRepairService(Number(id));
  }
}
