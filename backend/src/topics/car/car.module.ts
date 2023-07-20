import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CarController } from 'src/topics/car/car.controller';
import { CarService } from 'src/topics/car/car.service';

@Module({
  controllers: [CarController],
  providers: [CarService, PrismaService],
  exports: [CarService],
})
export class CarModule {}
