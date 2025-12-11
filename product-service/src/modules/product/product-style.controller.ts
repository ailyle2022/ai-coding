import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { ProductStyleService } from './product-style.service';
import { ProductStyle } from './product-style.entity';

@Controller('product-styles')
export class ProductStyleController {
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
  async create(@Body() productStyleData: Partial<ProductStyle>): Promise<ProductStyle> {
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
  async grpcFindAll(data: Empty): Promise<ProductStyleList> {
    const productStyles = await this.productStyleService.findAll();
    // 映射实体到 gRPC 响应格式
    const productStylesList = productStyles.map(style => ({
      id: style.id,
      name: style.name,
      description: style.description || '',
      is_active: style.isActive,
      created_at: style.createdAt ? new Date(style.createdAt).toISOString() : new Date().toISOString(),
      updated_at: style.updatedAt ? new Date(style.updatedAt).toISOString() : new Date().toISOString(),
    }));

    return { product_styles: productStylesList };
  }

  @GrpcMethod('ProductStyleService', 'FindOne')
  async grpcFindOne(data: ProductStyleId): Promise<any> {
    const productStyle = await this.productStyleService.findOne(data.id);
    // 映射实体到 gRPC 响应格式
    return {
      id: productStyle.id,
      name: productStyle.name,
      description: productStyle.description || '',
      is_active: productStyle.isActive,
      created_at: productStyle.createdAt ? new Date(productStyle.createdAt).toISOString() : new Date().toISOString(),
      updated_at: productStyle.updatedAt ? new Date(productStyle.updatedAt).toISOString() : new Date().toISOString(),
    };
  }

  @GrpcMethod('ProductStyleService', 'Create')
  async grpcCreate(data: CreateProductStyleRequest): Promise<any> {
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
      created_at: created.createdAt ? new Date(created.createdAt).toISOString() : new Date().toISOString(),
      updated_at: created.updatedAt ? new Date(created.updatedAt).toISOString() : new Date().toISOString(),
    };
  }

  @GrpcMethod('ProductStyleService', 'Update')
  async grpcUpdate(data: UpdateProductStyleRequest): Promise<any> {
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
      created_at: updated.createdAt ? new Date(updated.createdAt).toISOString() : new Date().toISOString(),
      updated_at: updated.updatedAt ? new Date(updated.updatedAt).toISOString() : new Date().toISOString(),
    };
  }

  @GrpcMethod('ProductStyleService', 'Remove')
  async grpcRemove(data: ProductStyleId): Promise<RemoveResponse> {
    await this.productStyleService.remove(data.id);
    return { success: true };
  }
}