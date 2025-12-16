import { Module } from '@nestjs/common';
import { RabbitMQService } from './rabbitmq.service';
import { BullMQService } from './bullmq.service';

@Module({
  providers: [RabbitMQService, BullMQService],
  exports: [RabbitMQService, BullMQService],
})
export class CommonModule {}