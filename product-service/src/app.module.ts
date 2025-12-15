import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductStyleModule } from './modules/product/product-style.module';
import { databaseConfig } from './config/database.config';
import { LoggerModule } from './config/logger.module';
import { CommonModule } from './modules/common/common.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(databaseConfig),
    ProductStyleModule,
    LoggerModule,
    CommonModule,
  ],
})
export class AppModule {}