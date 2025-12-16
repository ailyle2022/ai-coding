import { Injectable } from '@nestjs/common';
import { Order } from './order.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { SalesOrder } from './order.entity';
import { Repository } from 'typeorm';

@Injectable()
export class OrderService {
    constructor(
        @InjectRepository(SalesOrder)
        private salesOrderRepository: Repository<SalesOrder>,
    ) { }

    async findAll(): Promise<Order[]> {
        return this.salesOrderRepository.find();
    }
}
