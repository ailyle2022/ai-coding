import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { Queue, Worker, Job } from 'bullmq';
import IORedis from 'ioredis';

@Injectable()
export class BullMQService implements OnModuleInit, OnModuleDestroy {
  private queue: Queue;
  private worker: Worker;
  private redisConnection: IORedis;

  async onModuleInit() {
    // Initialize Redis connection with BullMQ required settings
    this.redisConnection = new IORedis({
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6379', 10),
      maxRetriesPerRequest: null,
    });

    // Initialize the queue
    this.queue = new Queue('tasks', {
      connection: this.redisConnection,
    });

    // Initialize the worker
    this.worker = new Worker(
      'tasks',
      async (job: Job) => {
        // Process the job
        console.log(`Processing job ${job.id} with data:`, job.data);
        
        // Simulate some work
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        return { processed: job.data };
      },
      {
        connection: this.redisConnection,
      },
    );

    this.worker.on('completed', job => {
      console.log(`${job.id} has completed!`);
    });

    this.worker.on('failed', (job, err) => {
      console.log(`${job.id} has failed with ${err.message}`);
    });
  }

  async onModuleDestroy() {
    if (this.queue) {
      await this.queue.close();
    }
    if (this.worker) {
      await this.worker.close();
    }
    if (this.redisConnection) {
      await this.redisConnection.quit();
    }
  }

  async addTask(name: string, data: any): Promise<Job> {
    return this.queue.add(name, data);
  }

  async getTasks(): Promise<{ id: string; name: string; data: any; status: string }[]> {
    const jobs = await this.queue.getJobs(['waiting', 'active', 'completed', 'failed']);
    const tasks = [];
    
    for (const job of jobs) {
      const status = await job.getState();
      tasks.push({
        id: job.id,
        name: job.name,
        data: job.data,
        status: status,
      });
    }
    
    return tasks;
  }
}