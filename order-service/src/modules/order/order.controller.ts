import { Controller, Get, Logger } from '@nestjs/common';
import { OrderService } from './order.service';
import { GrpcMethod } from '@nestjs/microservices';

@Controller('sales_orders')
export class OrderController {
  private readonly logger = new Logger(OrderController.name);

  constructor(private readonly orderService: OrderService) {}

  // gRPC 方法
  @GrpcMethod('SalesOrderService', 'FindAll')
  async grpcFindAll(data: Empty): Promise<iSalesOrderList> {
    this.logger.log('Fetching all product styles');
    const salesOrders = await this.orderService.findAll();
    // 映射实体到 gRPC 响应格式
    const salesOrdersList = salesOrders.map((order) => ({
      id: order.id,
      orderNumber: order.orderNumber,
      orignalOrderNumber: order.orignalOrderNumber || '',
      orderType: order.orderType || '',
      status: order.status || '',
      createdAt: order.createdAt
        ? new Date(order.createdAt).toISOString()
        : new Date().toISOString(),
      updatedAt: order.updatedAt
        ? new Date(order.updatedAt).toISOString()
        : new Date().toISOString(),
    }));

    return { salesOrders: salesOrdersList };
  }
}
