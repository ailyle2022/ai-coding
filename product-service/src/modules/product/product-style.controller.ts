import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { ProductStyleService } from './product-style.service';
import { ProductStyle } from './product-style.entity';

@Controller('product-styles')
export class ProductStyleController {
  constructor(private readonly productStyleService: ProductStyleService) {}

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
}