import { Body, Controller, DefaultValuePipe, Delete, Get, NotFoundException, Param, ParseIntPipe, Post, Put, Query } from '@nestjs/common';
import { GearBoxType, type Car, EnergyType } from '@prisma/client';
import { ApiValidationPipe } from 'src/common/pipes/api-validation.pipe';
import { PublicApi } from 'src/topics/auth/decorators/public-api.decorator';
import { Roles } from 'src/topics/auth/decorators/roles.decorator';
import { UserRoles } from 'src/topics/user/role.enum';
import * as _ from 'lodash';
import { CarService } from 'src/topics/car/car.service';
import { CarGetAllStats, CreateCarInputDto, GetAllCarInputDto, UpdateCarInputDto } from 'src/topics/car/dto/car.dto';
import { ResultAndStat } from 'src/common/models/result-and-stat.model';

@Controller('api/cars')
export class CarController {
  constructor(private readonly carService: CarService) {}

  @Get('')
  @PublicApi()
  public async getCars(
    @Query('limit', new DefaultValuePipe(50), ParseIntPipe) limit?: number,
    @Query('offset', new DefaultValuePipe(0), ParseIntPipe) offset?: number,
    @Query('q') q?: string,
    @Query('minPrice') minPrice?: number,
    @Query('maxPrice') maxPrice?: number,
    @Query('minMileage') minMileage?: number,
    @Query('maxMileage') maxMileage?: number,
    @Query('minCirculationDate') minCirculationDate?: number,
    @Query('maxCirculationDate') maxCirculationDate?: number,
    @Query('gearBox') gearBox?: GearBoxType,
    @Query('energy') energy?: EnergyType,
  ): Promise<ResultAndStat<Car[], CarGetAllStats>> {
    const params = {
      limit,
      offset,
      q: q ? q.trim().toLocaleLowerCase() : null,
      minPrice: +minPrice,
      maxPrice: +maxPrice,
      minMileage: +minMileage,
      maxMileage: +maxMileage,
      minCirculationDate: +minCirculationDate,
      maxCirculationDate: +maxCirculationDate,
      gearBox,
      energy,
    };
    this.carService.validateGetAllQP(params);
    const qp: GetAllCarInputDto = _.omitBy(params, (x) => _.isNil(x) || _.isNaN(x));
    return this.carService.fetchCars(qp);
  }

  @Get('stats')
  @PublicApi()
  public async getCarsStats(
    @Query('limit') limit?: number,
    @Query('offset') offset?: number,
    @Query('q') q?: string,
    @Query('minPrice') minPrice?: number,
    @Query('maxPrice') maxPrice?: number,
    @Query('minMileage') minMileage?: number,
    @Query('maxMileage') maxMileage?: number,
    @Query('minCirculationDate') minCirculationDate?: number,
    @Query('maxCirculationDate') maxCirculationDate?: number,
    @Query('gearBox') gearBox?: GearBoxType,
    @Query('energy') energy?: EnergyType,
  ): Promise<CarGetAllStats> {
    const params = {
      limit,
      offset,
      q: q ? q.trim().toLocaleLowerCase() : null,
      minPrice: +minPrice,
      maxPrice: +maxPrice,
      minMileage: +minMileage,
      maxMileage: +maxMileage,
      minCirculationDate: +minCirculationDate,
      maxCirculationDate: +maxCirculationDate,
      gearBox,
      energy,
    };
    this.carService.validateGetAllQP(params);
    const qp: GetAllCarInputDto = _.omitBy(params, (x) => _.isNil(x) || _.isNaN(x));
    return this.carService.getStats(qp);
  }

  @Post('')
  @Roles(UserRoles.ADMIN, UserRoles.EMPLOYEE)
  public async createCar(@Body(new ApiValidationPipe()) requestBody: CreateCarInputDto): Promise<Car> {
    return this.carService.createCar(requestBody);
  }

  @Get(':id')
  @PublicApi()
  public async getCar(@Param('id', ParseIntPipe) id: string): Promise<Car> {
    return this.carService.fetchCarByPk(Number(id));
  }

  @Put(':id')
  @Roles(UserRoles.ADMIN, UserRoles.EMPLOYEE)
  public async updateCar(@Param('id') id: string, @Body(new ApiValidationPipe()) requestBody: UpdateCarInputDto): Promise<Car> {
    const car = await this.carService.fetchCarByPk(Number(id));
    if (!car) throw new NotFoundException();

    return this.carService.updateCar(Number(id), requestBody);
  }

  @Delete(':id')
  @Roles(UserRoles.ADMIN, UserRoles.EMPLOYEE)
  async deleteCar(@Param('id', ParseIntPipe) id: string): Promise<Car> {
    return this.carService.deleteCar(Number(id));
  }
}
