import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { RepairServiceController } from 'src/topics/repair-service/repair-service.controller';
import { RepairServiceService } from 'src/topics/repair-service/repair-service.service';

@Module({
  controllers: [RepairServiceController],
  providers: [RepairServiceService, PrismaService],
  exports: [RepairServiceService],
})
export class RepairServiceModule {}
