import { join } from 'path';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

async function bootstrap() {
  // 创建gRPC微服务
  const grpcApp = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.GRPC,
      options: {
        package: 'order',
        protoPath: join(__dirname, 'proto/order.proto'),
        url: 'localhost:50052',
      },
    },
  );

  // 使用winston日志
  const logger = grpcApp.get(WINSTON_MODULE_NEST_PROVIDER);
  grpcApp.useLogger(logger);

  // 创建RESTful HTTP应用
  const restApp = await NestFactory.create(AppModule);
  restApp.useLogger(logger);
  restApp.enableCors(); // Enable CORS for the RESTful API
  
  // 启动两个应用
  await grpcApp.listen();
  await restApp.listen(3002);
  
  logger.log('Order Service gRPC is running on port 50052');
  logger.log('Order Service RESTful API is running on port 3002');
}

bootstrap();