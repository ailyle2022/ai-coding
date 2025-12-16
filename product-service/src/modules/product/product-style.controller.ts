import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Logger,
} from '@nestjs/common';
import { GrpcMethod, RpcException } from '@nestjs/microservices';
import { ProductStyleService } from './product-style.service';
import { ProductStyle } from './product-style.entity';

@Controller('product-styles')
export class ProductStyleController {
  private readonly logger = new Logger(ProductStyleController.name);

  constructor(private readonly productStyleService: ProductStyleService) {}

  // gRPC 方法
  @GrpcMethod('ProductStyleService', 'FindAll')
  async grpcFindAll(data: Empty): Promise<iProductStyleList> {
    this.logger.log('Fetching all product styles');
    const productStyles = await this.productStyleService.findAll();
    // 映射实体到 gRPC 响应格式
    const productStylesList = productStyles.map((style) => ({
      id: style.id,
      name: style.name,
      description: style.description || '',
      isActive: style.isActive,
      createdAt: style.createdAt
        ? new Date(style.createdAt).toISOString()
        : new Date().toISOString(),
      updatedAt: style.updatedAt
        ? new Date(style.updatedAt).toISOString()
        : new Date().toISOString(),
    }));

    return { productStyles: productStylesList };
  }

  @GrpcMethod('ProductStyleService', 'FindOne')
  async grpcFindOne(data: iProductStyleId): Promise<iProductStyle> {
    const productStyle = await this.productStyleService.findOne(data.id);

    // 如果找不到对应的产品样式，抛出一个gRPC异常
    if (!productStyle) {
      throw new RpcException(`Product style with id ${data.id} not found`);
    }

    // 确保日期字段处理方式与FindAll一致
    const result: iProductStyle = {
      id: productStyle.id,
      name: productStyle.name ?? '',
      description: productStyle.description || '',
      isActive: productStyle.isActive ?? false,
      createdAt:
        productStyle.createdAt instanceof Date
          ? productStyle.createdAt.toISOString()
          : typeof productStyle.createdAt === 'string'
            ? productStyle.createdAt
            : new Date().toISOString(),
      updatedAt:
        productStyle.updatedAt instanceof Date
          ? productStyle.updatedAt.toISOString()
          : typeof productStyle.updatedAt === 'string'
            ? productStyle.updatedAt
            : new Date().toISOString(),
    };

    return result;
  }

  @GrpcMethod('ProductStyleService', 'Create')
  async grpcCreate(data: iCreateProductStyleRequest): Promise<any> {
    const created = await this.productStyleService.create({
      name: data.name,
      description: data.description,
      isActive: data.isActive,
    });

    // 映射实体到 gRPC 响应格式
    return {
      id: created.id,
      name: created.name,
      description: created.description || '',
      isActive: created.isActive,
      createdAt: created.createdAt
        ? new Date(created.createdAt).toISOString()
        : new Date().toISOString(),
      updatedAt: created.updatedAt
        ? new Date(created.updatedAt).toISOString()
        : new Date().toISOString(),
    };
  }

  @GrpcMethod('ProductStyleService', 'Update')
  async grpcUpdate(data: iUpdateProductStyleRequest): Promise<any> {
    if (!data.id) {
      throw new RpcException(`data.id not found`);
    }

    const productStyle = await this.productStyleService.findOne(data.id);

    // 如果找不到对应的产品样式，抛出异常
    if (!productStyle) {
      throw new RpcException(`Product style with id ${data.id} not found`);
    }

    const updated = await this.productStyleService.update(data.id, {
      description: data.description,
      isActive: data.isActive,
    });

    // 映射实体到 gRPC 响应格式
    return {
      id: updated.id,
      name: updated.name,
      description: updated.description || '',
      isActive: updated.isActive,
      createdAt: updated.createdAt
        ? new Date(updated.createdAt).toISOString()
        : new Date().toISOString(),
      updatedAt: updated.updatedAt
        ? new Date(updated.updatedAt).toISOString()
        : new Date().toISOString(),
    };
  }

  @GrpcMethod('ProductStyleService', 'Remove')
  async grpcRemove(data: iProductStyleId): Promise<iRemoveResponse> {
    await this.productStyleService.remove(data.id);
    return { success: true };
  }
}
