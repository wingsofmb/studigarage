import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { Car, EnergyType, GearBoxType } from '@prisma/client';
import { CarGetAllStats, CreateCarInputDto, GetAllCarInputDto, UpdateCarInputDto } from 'src/topics/car/dto/car.dto';
import * as _ from 'lodash';
import { DateTime } from 'luxon';
import { isEnum } from 'class-validator';
import { ResultAndStat } from 'src/common/models/result-and-stat.model';

@Injectable()
export class CarService {
  constructor(private readonly prismaService: PrismaService) {}

  public async fetchCarByPk(id: number): Promise<Car> {
    return this.prismaService.car.findUnique({ where: { id } });
  }

  public validateGetAllQP(params): void {
    const numberItems = _.omit(params, ['q']);
    const matchFailure = _.mapValues(numberItems, (num) => !_.isNil(num) && (num < 0 || num >= Number.MAX_SAFE_INTEGER));
    const hasFailure = _.filter(_.values(matchFailure), (x) => x).length > 0;
    if (hasFailure) throw new BadRequestException('Wrong number input detected');
    if (params.gearBox && !isEnum(params.gearBox, GearBoxType)) throw new BadRequestException('gearBox must be of type GearBoxType');
    if (params.energy && !isEnum(params.energy, EnergyType)) throw new BadRequestException('energy must be of type EnergyType');
  }

  public async getStats(qp?: GetAllCarInputDto): Promise<CarGetAllStats> {
    const rawStats = await this.prismaService.car.aggregate({
      where: this.computeGetAllGetClause(qp ?? {}),
      _count: { _all: true },
      _max: { price: true, mileage: true },
      _min: { price: true, mileage: true, firstCirculationDate: true },
    });
    return !rawStats._count._all
      ? { count: 0 }
      : {
          count: rawStats._count._all,
          minPriceLimit: rawStats._min.price,
          maxPriceLimit: rawStats._max.price,
          minMileageLimit: rawStats._min.mileage,
          maxMileageLimit: rawStats._max.mileage,
          minCirculationDateLimit: rawStats._min.firstCirculationDate.getFullYear(),
        };
  }

  public async fetchCars(qp: GetAllCarInputDto): Promise<ResultAndStat<Car[], CarGetAllStats>> {
    const skip = qp.offset * qp.limit;
    const hasfilters = _.keys(_.omit(qp, ['limit', 'offset'])).length > 0;
    const stats = await this.getStats(qp);
    const result = await this.prismaService.car.findMany({
      ...(!hasfilters
        ? {}
        : {
            where: this.computeGetAllGetClause(qp),
          }),
      skip,
      take: qp.limit,
      orderBy: [{ createdAt: 'desc' }],
    });

    return { result, stats };
  }

  public async createCar(requestBody: CreateCarInputDto): Promise<Car> {
    return this.prismaService.car.create({ data: requestBody });
  }

  public async updateCar(id: number, requestBody: UpdateCarInputDto): Promise<Car> {
    await this.prismaService.car.findUniqueOrThrow({ where: { id } });
    return this.prismaService.car.update({ where: { id }, data: requestBody });
  }

  public async deleteCar(id: number): Promise<Car> {
    return this.prismaService.car.delete({ where: { id: Number(id) } });
  }

  private computeGetAllGetClause(qp?: GetAllCarInputDto): any {
    return {
      ...(!_.isNil(qp.q) ? { OR: [{ brand: { startsWith: qp.q, mode: 'insensitive' } }, { model: { startsWith: qp.q, mode: 'insensitive' } }] } : {}),
      ...(!_.isNil(qp.minPrice) ? { price: { gte: qp.minPrice } } : {}),
      ...(!_.isNil(qp.maxPrice) ? { price: { lte: qp.maxPrice + 1 } } : {}),
      ...(!_.isNil(qp.minPrice) && !_.isNil(qp.maxPrice) ? { price: { lte: qp.maxPrice, gte: qp.minPrice } } : {}),
      ...(!_.isNil(qp.minMileage) ? { mileage: { gte: qp.minMileage } } : {}),
      ...(!_.isNil(qp.maxMileage) ? { mileage: { lte: qp.maxMileage } } : {}),
      ...(!_.isNil(qp.minMileage) && !_.isNil(qp.maxMileage) ? { mileage: { lte: qp.maxMileage, gte: qp.minMileage } } : {}),
      ...(!_.isNil(qp.minCirculationDate) ? { firstCirculationDate: { gte: `${DateTime.fromObject({ year: qp.minCirculationDate })}` } } : {}),
      ...(!_.isNil(qp.maxCirculationDate)
        ? { firstCirculationDate: { lte: `${DateTime.fromObject({ year: qp.maxCirculationDate }).endOf('year')}` } }
        : {}),
      ...(!_.isNil(qp.minCirculationDate) && !_.isNil(qp.maxCirculationDate)
        ? {
            firstCirculationDate: {
              lte: `${DateTime.fromObject({ year: qp.maxCirculationDate }).endOf('year')}`,
              gte: `${DateTime.fromObject({ year: qp.minCirculationDate })}`,
            },
          }
        : {}),
      ...(!_.isNil(qp.energy) ? { energy: { equals: qp.energy } } : {}),
      ...(!_.isNil(qp.gearBox) ? { gearBox: { equals: qp.gearBox } } : {}),
    };
  }
}
