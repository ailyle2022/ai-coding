import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import * as redis from 'redis';
import { User } from '../user/user.entity';

@Injectable()
export class CacheService implements OnModuleInit, OnModuleDestroy {
  public redisClient: ReturnType<typeof redis.createClient>;

  constructor() {
    // 初始化Redis客户端
    this.redisClient = redis.createClient({
      socket: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379', 10),
      }
    });
  }

  async onModuleInit() {
    // 连接到Redis服务器
    await this.redisClient.connect().catch(console.error);
  }

  async onModuleDestroy() {
    // 断开Redis连接
    await this.redisClient.quit().catch(console.error);
  }
}