import { Module } from '@nestjs/common';
import { PasswordService } from './password.service';
import { CacheService } from './cache.service';
import { RabbitMQService } from './rabbitmq.service';

@Module({
  providers: [PasswordService, CacheService, RabbitMQService],
  exports: [PasswordService, CacheService, RabbitMQService],
})
export class CommonModule {}