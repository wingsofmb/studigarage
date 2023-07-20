import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { Car, EnergyType, GearBoxType, Prisma, carPicture } from '@prisma/client';
import { CarGetAllStats, CreateCarInputDto, GetAllCarInputDto, UpdateCarInputDto } from 'src/topics/car/dto/car.dto';
import * as _ from 'lodash';
import { DateTime } from 'luxon';
import { isEnum } from 'class-validator';
import { ResultAndStat } from 'src/common/models/result-and-stat.model';

@Injectable()
export class CarService {
  constructor(private readonly prismaService: PrismaService) {}

  public async fetchCarByPk(id: number): Promise<Car> {
    return this.prismaService.car.findUnique({ where: { id }, include: { carPictures: true } });
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
    const picturesData = requestBody.carPictures;
    const carData = _.omit(requestBody, ['carPicture']);
    const createdCar = await this.prismaService.car.create({ data: carData as Prisma.CarCreateInput });
    if (!picturesData?.length) return createdCar;

    await this.prismaService.carPicture.createMany({
      data: picturesData.map((pd) => ({
        fileUrl: pd.fileUrl,
        carId: createdCar.id,
      })),
    });
    return this.fetchCarByPk(createdCar.id);
  }

  public async updateCar(id: number, requestBody: UpdateCarInputDto): Promise<Car> {
    await this.prismaService.car.findUniqueOrThrow({ where: { id } });

    const picturesData = requestBody.carPictures;
    const carData = _.omit(requestBody, ['carPictures']);
    await this.prismaService.car.update({ where: { id }, data: carData as Prisma.CarUpdateInput });

    const currentPictures = (await this.prismaService.carPicture.findMany({ where: { carId: id } })).map((pic) => _.pick(pic, ['id', 'fileUrl']));
    const picturesToCompare = picturesData.map((pic) => _.pick(pic, ['id', 'fileUrl']));
    console.log('currentPictures', currentPictures);

    const toAdd = _.filter(picturesToCompare, (pic) => !pic.id).map((pic) => ({ ...pic, carId: id }));
    const toRemove = _.filter(currentPictures, (pic) => !_.compact(picturesToCompare.map((p) => p.id)).includes(pic.id)); // OK
    const toUpdate = _.filter(currentPictures, (pic) => {
      const match = _.filter(picturesToCompare, (x) => x.id).find((it: carPicture) => it.id === pic.id);
      return match && (match as carPicture).fileUrl !== pic.fileUrl;
    }).map((currentToUpdate) => picturesToCompare.find((it) => it.id === currentToUpdate.id));

    console.log('toAdd', toAdd);
    console.log('toRemove', toRemove);
    console.log('toUpdate', toUpdate);
    if (toAdd.length) await this.prismaService.carPicture.createMany({ data: toAdd as Prisma.carPictureCreateManyInput[] });
    if (toRemove.length) await this.prismaService.carPicture.deleteMany({ where: { id: { in: toRemove.map((x) => x.id) } } });
    if (toUpdate.length) {
      for (const up of toUpdate) await this.prismaService.carPicture.updateMany({ data: up, where: { id: up.id } });
    }

    return this.fetchCarByPk(id);
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
