import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CommonModule } from './modules/common/common.module';
import { LoggerModule } from './config/logger.module';

@Module({
  imports: [CommonModule, LoggerModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
