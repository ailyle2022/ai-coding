import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductStyle } from './product-style.entity';

@Injectable()
export class ProductStyleService {
  constructor(
    @InjectRepository(ProductStyle)
    private productStyleRepository: Repository<ProductStyle>,
  ) {}

  async findAll(): Promise<ProductStyle[]> {
    return this.productStyleRepository.find();
  }

  async findOne(id: number): Promise<ProductStyle> {
    return this.productStyleRepository.findOne({ where: { id } });
  }

  async create(productStyleData: Partial<ProductStyle>): Promise<ProductStyle> {
    const productStyle = this.productStyleRepository.create(productStyleData);
    return this.productStyleRepository.save(productStyle);
  }

  async update(
    id: number,
    productStyleData: Partial<ProductStyle>,
  ): Promise<ProductStyle> {
    await this.productStyleRepository.update(id, productStyleData);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.productStyleRepository.delete(id);
  }
}
