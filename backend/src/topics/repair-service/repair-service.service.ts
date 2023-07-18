import { Injectable } from '@nestjs/common';
import { RepairService } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { CreateRepairServiceInputDto } from 'src/topics/repair-service/dto/repair-services.dto';

@Injectable()
export class RepairServiceService {
  constructor(private readonly prismaService: PrismaService) {}

  public async fetchRepairServices(): Promise<RepairService[]> {
    return this.prismaService.repairService.findMany();
  }

  public async createRepairService(requestBody: CreateRepairServiceInputDto): Promise<RepairService> {
    return this.prismaService.repairService.create({ data: requestBody });
  }

  public async deleteRepairService(id: number): Promise<RepairService> {
    return this.prismaService.repairService.delete({ where: { id: Number(id) } });
  }
}
