import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { TimetableController } from 'src/topics/timetable/timetable.controller';
import { TimetableService } from 'src/topics/timetable/timetable.service';

@Module({
  controllers: [TimetableController],
  providers: [TimetableService, PrismaService],
  exports: [TimetableService],
})
export class TimetableModule {}
