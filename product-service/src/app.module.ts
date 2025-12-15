import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductStyleModule } from './modules/product/product-style.module';
import { databaseConfig } from './config/database.config';
import { LoggerModule } from './config/logger.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(databaseConfig),
    ProductStyleModule,
    LoggerModule,
  ],
})
export class AppModule {}
