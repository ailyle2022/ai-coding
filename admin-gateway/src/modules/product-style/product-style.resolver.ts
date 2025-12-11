import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { ProductStyle } from './product-style.entity';
import { ProductStyleService } from './product-style.service';

@Resolver(() => ProductStyle)
export class ProductStyleResolver {
  constructor(private readonly productStyleService: ProductStyleService) {}

  @Query(() => [ProductStyle], { name: 'productStyles' })
  async getProductStyles(): Promise<ProductStyle[]> {
    return this.productStyleService.findAll();
  }

  @Query(() => ProductStyle, { name: 'productStyle' })
  async getProductStyle(@Args('id', { type: () => Int }) id: number): Promise<ProductStyle> {
    return this.productStyleService.findOne(id);
  }

  @Mutation(() => ProductStyle)
  async createProductStyle(
    @Args('input') productStyleData: Partial<ProductStyle>,
  ): Promise<ProductStyle> {
    return this.productStyleService.create(productStyleData);
  }

  @Mutation(() => ProductStyle)
  async updateProductStyle(
    @Args('id', { type: () => Int }) id: number,
    @Args('input') productStyleData: Partial<ProductStyle>,
  ): Promise<ProductStyle> {
    return this.productStyleService.update(id, productStyleData);
  }

  @Mutation(() => Boolean)
  async deleteProductStyle(@Args('id', { type: () => Int }) id: number): Promise<boolean> {
    return this.productStyleService.remove(id);
  }
}