import { Injectable } from '@nestjs/common';
import { Timetable } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { UpdateTimetableInputDto } from 'src/topics/timetable/dto/timetable.dto';

@Injectable()
export class TimetableService {
  constructor(private readonly prismaService: PrismaService) {}

  public async fetchTimetables(): Promise<Timetable[]> {
    return this.prismaService.timetable.findMany();
  }

  public async fetchTimetableByPk(id: number): Promise<Timetable> {
    return this.prismaService.timetable.findUnique({ where: { id: id } });
  }

  public async updateTimetable(id: number, requestBody: UpdateTimetableInputDto): Promise<Timetable> {
    await this.prismaService.timetable.findUniqueOrThrow({ where: { id } });
    return this.prismaService.timetable.update({ where: { id }, data: requestBody });
  }
}
