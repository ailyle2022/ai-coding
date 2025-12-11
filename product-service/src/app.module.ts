import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { databaseConfig } from './config/database.config';
import { ProductStyle } from './modules/product/product-style.entity';
import { ProductStyleService } from './modules/product/product-style.service';
import { ProductStyleController } from './modules/product/product-style.controller';

@Module({
  imports: [
    TypeOrmModule.forRoot(databaseConfig),
    TypeOrmModule.forFeature([ProductStyle])
  ],
  controllers: [AppController, ProductStyleController],
  providers: [AppService, ProductStyleService],
})
export class AppModule {}