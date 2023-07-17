import { Body, Controller, Get, NotFoundException, Param, Put } from '@nestjs/common';
import type { Timetable } from '@prisma/client';
import { ApiValidationPipe } from 'src/common/pipes/api-validation.pipe';
import { PublicApi } from 'src/topics/auth/decorators/public-api.decorator';
import { Roles } from 'src/topics/auth/decorators/roles.decorator';
import { UpdateTimetableInputDto } from 'src/topics/timetable/dto/timetable.dto';
import { TimetableService } from 'src/topics/timetable/timetable.service';
import { UserRoles } from 'src/topics/user/role.enum';

@Controller('api/timetable')
export class TimetableController {
  constructor(private readonly timetableService: TimetableService) {}

  @Get('')
  @PublicApi()
  public async getTimetable(): Promise<Timetable[]> {
    return this.timetableService.fetchTimetables();
  }

  @Put(':id')
  @Roles(UserRoles.ADMIN)
  public async updateTimetable(@Param('id') id: string, @Body(new ApiValidationPipe()) requestBody: UpdateTimetableInputDto): Promise<Timetable> {
    const timetable = await this.timetableService.fetchTimetableByPk(Number(id));
    if (!timetable) throw new NotFoundException();

    return this.timetableService.updateTimetable(Number(id), requestBody);
  }
}
