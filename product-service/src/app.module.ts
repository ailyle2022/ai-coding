import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { databaseConfig } from './config/database.config';
import { ProductStyleModule } from './modules/product/product-style.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(databaseConfig),
    ProductStyleModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}