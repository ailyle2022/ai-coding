import { join } from 'path';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';

async function bootstrap() {
  // 创建gRPC微服务
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.GRPC,
      options: {
        package: 'product',
        protoPath: join(__dirname, 'proto/product.proto'),
        url: 'localhost:50051',
      },
    },
  );

  await app.listen();
  console.log('Product Service is running on port 50051');
}
bootstrap();