import { NestFactory } from '@nestjs/core';
import { config as dotenvConfig } from 'dotenv';
import { AppModule } from './app.module';

dotenvConfig();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3001);
}
bootstrap();