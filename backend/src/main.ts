import { NestFactory } from '@nestjs/core';
import { AppModule } from 'src/app.module';
import { env } from 'process';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(env.PORT);
}
bootstrap();
