import { Module } from '@nestjs/common';
import { ProductStyleResolver } from './product-style.resolver';
import { ProductStyleService } from './product-style.service';
import { join } from 'path';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'PRODUCT_SERVICE',
        transport: Transport.GRPC,
        options: {
          package: 'product',
          protoPath: join(
            __dirname,
            '..',
            '..',
            '..',
            'src',
            'modules',
            'product-service',
            'proto',
            'product.proto',
          ),
          url: 'localhost:50051',
        },
      },
    ]),
  ],
  providers: [ProductStyleResolver, ProductStyleService],
  exports: [ProductStyleService],
})
export class ProductStyleModule {}
