import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductStyle } from './product-style.entity';
import { ProductStyleService } from './product-style.service';
import { ProductStyleController } from './product-style.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ProductStyle])],
  providers: [ProductStyleService],
  controllers: [ProductStyleController],
  exports: [ProductStyleService],
})
export class ProductStyleModule {}
