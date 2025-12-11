import { Injectable } from '@nestjs/common';
import { ProductStyle } from './product-style.entity';

// 模拟数据，后续将通过gRPC连接到product-service
let productStyles: ProductStyle[] = [
  {
    id: 1,
    name: '现代风格',
    description: '现代简约设计风格',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 2,
    name: '古典风格',
    description: '传统古典设计风格',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// 模拟ID生成器
let nextId = 3;

@Injectable()
export class ProductStyleService {
  async findAll(): Promise<ProductStyle[]> {
    return productStyles;
  }

  async findOne(id: number): Promise<ProductStyle> {
    return productStyles.find(style => style.id === id);
  }

  async create(productStyleData: Partial<ProductStyle>): Promise<ProductStyle> {
    const productStyle = new ProductStyle();
    Object.assign(productStyle, productStyleData);
    productStyle.id = nextId++;
    productStyle.createdAt = new Date().toISOString();
    productStyle.updatedAt = new Date().toISOString();
    
    productStyles.push(productStyle);
    return productStyle;
  }

  async update(id: number, productStyleData: Partial<ProductStyle>): Promise<ProductStyle> {
    const index = productStyles.findIndex(style => style.id === id);
    if (index === -1) {
      return null;
    }
    
    Object.assign(productStyles[index], productStyleData, { updatedAt: new Date().toISOString() });
    return productStyles[index];
  }

  async remove(id: number): Promise<boolean> {
    const index = productStyles.findIndex(style => style.id === id);
    if (index === -1) {
      return false;
    }
    
    productStyles.splice(index, 1);
    return true;
  }
}