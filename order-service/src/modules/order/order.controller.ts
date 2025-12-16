import { Controller, Get, Logger } from '@nestjs/common';
import { Order } from './order.interface';
import { OrderService } from './order.service';

@Controller('sales_orders')
export class OrderController {
    private readonly logger = new Logger(OrderController.name);

    constructor(private readonly orderService: OrderService) { }

    @Get()
    async findAll(): Promise<Order[]> {
        try {
            const salesOrders = await this.orderService.findAll();
            return salesOrders;
        } catch (error) {
            this.logger.error('Error fetching all sales orders', error.stack);
            throw error;
        }
    }
}
