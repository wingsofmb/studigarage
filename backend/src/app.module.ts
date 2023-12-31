import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { AppController } from 'src/app.controller';
import { AppService } from 'src/app.service';
import { LoggerMiddleware } from 'src/common/middlewares/logger.middleware';
import { PrismaService } from 'src/prisma.service';
import { UserModule } from 'src/topics/user/user.module';
import { AuthModule } from 'src/topics/auth/auth.module';
import { SettingModule } from 'src/topics/setting/setting.module';
import { TimetableModule } from 'src/topics/timetable/timetable.module';
import { RepairServiceModule } from 'src/topics/repair-service/repair-service.module';
import { ReviewModule } from 'src/topics/review/review.module';
import { CarModule } from 'src/topics/car/car.module';

@Module({
  imports: [UserModule, AuthModule, SettingModule, TimetableModule, RepairServiceModule, ReviewModule, CarModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
