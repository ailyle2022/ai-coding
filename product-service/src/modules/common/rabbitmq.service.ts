import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import * as amqp from 'amqplib';

@Injectable()
export class RabbitMQService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(RabbitMQService.name);
  private connection: amqp.Connection | null = null;
  private channel: amqp.Channel | null = null;

  async onModuleInit() {
    try {
      // 连接到RabbitMQ服务器
      const host = process.env.RABBITMQ_HOST || 'localhost';
      const port = process.env.RABBITMQ_PORT || '5672';
      const username = process.env.RABBITMQ_USER || 'admin';
      const password = process.env.RABBITMQ_PASSWORD || 'admin_password';
      
      const connection = await amqp.connect(`amqp://${username}:${password}@${host}:${port}`);
      this.connection = connection as unknown as amqp.Connection;
      
      // 创建通道
      this.channel = await this.connection.createChannel();
      
      // 确保交换机存在
      await this.channel.assertExchange('events', 'topic', { durable: true });
      
      // 创建队列并绑定到交换机
      await this.setupEventListeners();
    } catch (error) {
      this.logger.error('Failed to connect to RabbitMQ:', error);
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
   * 设置事件监听器
   */
  private async setupEventListeners(): Promise<void> {
    if (!this.channel) return;

    try {
      // 创建队列
      const queue = await this.channel.assertQueue('product_service_events', { 
        durable: true,
        maxLength: 10000,
        //messageTtl: 300000,            // Messages expire after 5 minutes (300,000 ms)
        //expires: 600000,  
      });
      
      // 绑定队列到交换机，订阅helloEvent事件
      await this.channel.bindQueue(queue.queue, 'events', 'helloEvent');
      
      // 开始消费消息
      await this.channel.consume(queue.queue, (msg) => {
        if (msg) {
          try {
            const event = JSON.parse(msg.content.toString());
            this.handleHelloEvent(event);
            
            // 确认消息已被处理
            this.channel.ack(msg);
          } catch (error) {
            this.logger.error('Failed to process message:', error);
            // 否认消息并重新排队
            this.channel.nack(msg, false, true);
          }
        }
      });
      
      this.logger.log('RabbitMQ event listeners set up successfully');
    } catch (error) {
      this.logger.error('Failed to set up event listeners:', error);
    }
  }

  /**
   * 处理helloEvent事件
   * @param event 事件数据
   */
  private handleHelloEvent(event: any): void {
    this.logger.log('Received helloEvent:', event);
    // 在这里可以添加更多的事件处理逻辑
  }
}