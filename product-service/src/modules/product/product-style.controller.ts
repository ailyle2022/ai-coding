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
import { GrpcMethod } from '@nestjs/microservices';
import { ProductStyleService } from './product-style.service';
import { ProductStyle } from './product-style.entity';

@Controller('product-styles')
export class ProductStyleController {
  private readonly logger = new Logger(ProductStyleController.name);

  constructor(private readonly productStyleService: ProductStyleService) {}

  // REST API方法
  @Get()
  async findAll(): Promise<ProductStyle[]> {
    return this.productStyleService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<ProductStyle> {
    return this.productStyleService.findOne(id);
  }

  @Post()
  async create(
    @Body() productStyleData: Partial<ProductStyle>,
  ): Promise<ProductStyle> {
    return this.productStyleService.create(productStyleData);
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() productStyleData: Partial<ProductStyle>,
  ): Promise<ProductStyle> {
    return this.productStyleService.update(id, productStyleData);
  }

  @Delete(':id')
  async remove(@Param('id') id: number): Promise<void> {
    return this.productStyleService.remove(id);
  }

  // gRPC 方法
  @GrpcMethod('ProductStyleService', 'FindAll')
  async grpcFindAll(data: Empty): Promise<iProductStyleList> {
    const productStyles = await this.productStyleService.findAll();
    // 映射实体到 gRPC 响应格式
    const productStylesList = productStyles.map((style) => ({
      id: style.id,
      name: style.name,
      description: style.description || '',
      is_active: style.isActive,
      created_at: style.createdAt
        ? new Date(style.createdAt).toISOString()
        : new Date().toISOString(),
      updated_at: style.updatedAt
        ? new Date(style.updatedAt).toISOString()
        : new Date().toISOString(),
    }));

    console.log(productStylesList);

    return { product_styles: productStylesList };
  }

  @GrpcMethod('ProductStyleService', 'FindOne')
  async grpcFindOne(data: iProductStyleId): Promise<iProductStyle> {
    const productStyle = await this.productStyleService.findOne(data.id);

    // 确保日期字段处理方式与FindAll一致
    const result: iProductStyle = {
      id: productStyle.id ?? 0,
      name: productStyle.name ?? '',
      description: productStyle.description || '',
      is_active: productStyle.isActive ?? false,
      created_at:
        productStyle.createdAt instanceof Date
          ? productStyle.createdAt.toISOString()
          : typeof productStyle.createdAt === 'string'
            ? productStyle.createdAt
            : new Date().toISOString(),
      updated_at:
        productStyle.updatedAt instanceof Date
          ? productStyle.updatedAt.toISOString()
          : typeof productStyle.updatedAt === 'string'
            ? productStyle.updatedAt
            : new Date().toISOString(),
    };

    this.logger.debug(
      'FindOne result before serialization:',
      JSON.stringify(result, null, 2),
    );

    return result;
  }

  @GrpcMethod('ProductStyleService', 'Create')
  async grpcCreate(data: iCreateProductStyleRequest): Promise<any> {
    const created = await this.productStyleService.create({
      name: data.name,
      description: data.description,
      isActive: data.is_active,
    });

    // 映射实体到 gRPC 响应格式
    return {
      id: created.id,
      name: created.name,
      description: created.description || '',
      is_active: created.isActive,
      created_at: created.createdAt
        ? new Date(created.createdAt).toISOString()
        : new Date().toISOString(),
      updated_at: created.updatedAt
        ? new Date(created.updatedAt).toISOString()
        : new Date().toISOString(),
    };
  }

  @GrpcMethod('ProductStyleService', 'Update')
  async grpcUpdate(data: iUpdateProductStyleRequest): Promise<any> {
    const updated = await this.productStyleService.update(data.id, {
      description: data.description,
      isActive: data.is_active,
    });

    // 映射实体到 gRPC 响应格式
    return {
      id: updated.id,
      name: updated.name,
      description: updated.description || '',
      is_active: updated.isActive,
      created_at: updated.createdAt
        ? new Date(updated.createdAt).toISOString()
        : new Date().toISOString(),
      updated_at: updated.updatedAt
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
