import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // 设置安全相关的HTTP头
  app.enableCors({
    credentials: true,
    origin: true,
  });
  
  app.use((req, res, next) => {
    res.header('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.header('X-Content-Type-Options', 'nosniff');
    res.header('X-Frame-Options', 'DENY');
    next();
  });
  
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();