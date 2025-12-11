import { Module } from '@nestjs/common';
import { ProductStyleResolver } from './product-style.resolver';
import { ProductStyleService } from './product-style.service';

@Module({
  providers: [ProductStyleResolver, ProductStyleService],
  exports: [ProductStyleService],
})
export class ProductStyleModule {}