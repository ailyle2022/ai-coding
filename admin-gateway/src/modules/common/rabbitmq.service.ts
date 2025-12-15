import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import * as amqp from 'amqplib';

@Injectable()
export class RabbitMQService implements OnModuleInit, OnModuleDestroy {
  private connection: amqp.Connection | null = null;
  private channel: amqp.Channel | null = null;

  async onModuleInit() {
    try {
      // 连接到RabbitMQ服务器
      this.connection = await amqp.connect({
        hostname: process.env.RABBITMQ_HOST || 'localhost',
        port: parseInt(process.env.RABBITMQ_PORT || '5672', 10),
        username: process.env.RABBITMQ_USER || 'admin',
        password: process.env.RABBITMQ_PASSWORD || 'admin_password',
      });
      
      // 创建通道
      this.channel = await this.connection.createChannel();
      
      // 确保交换机存在
      await this.channel.assertExchange('events', 'topic', { durable: true });
    } catch (error) {
      console.error('Failed to connect to RabbitMQ:', error);
    }
  }

  async onModuleDestroy() {
    if (this.channel) {
      await this.channel.close();
    }
    if (this.connection) {
      await this.connection.close();
    }
  }

  /**
   * 发布事件到RabbitMQ
   * @param eventName 事件名称
   * @param data 事件数据
   */
  async publishEvent(eventName: string, data: any): Promise<void> {
    if (!this.channel) {
      console.error('RabbitMQ channel is not available');
      return;
    }

    try {
      const message = JSON.stringify(data);
      this.channel.publish('events', eventName, Buffer.from(message));
    } catch (error) {
      console.error(`Failed to publish event ${eventName}:`, error);
    }
  }
}