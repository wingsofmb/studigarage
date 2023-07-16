import { Controller, Get } from '@nestjs/common';
import { AppService } from 'src/app.service';
import { PublicApi } from 'src/topics/auth/decorators/public-api.decorator';

@Controller('api/')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('health-check')
  @PublicApi()
  getHello(): { status: string } {
    return { status: this.appService.getHello() };
  }
}
