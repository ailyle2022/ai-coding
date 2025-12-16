import { Controller, Get, Post, Body } from '@nestjs/common';
import { AppService } from './app.service';
import { BullMQService } from './modules/common/bullmq.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly bullMQService: BullMQService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('task')
  async addTask(@Body() taskData: { name: string; data: any }): Promise<any> {
    const job = await this.bullMQService.addTask(taskData.name, taskData.data);
    return {
      success: true,
      jobId: job.id,
      message: `Task ${taskData.name} added successfully`,
    };
  }

  @Get('tasks')
  async getTasks(): Promise<any> {
    const tasks = await this.bullMQService.getTasks();
    return {
      success: true,
      tasks,
    };
  }
}