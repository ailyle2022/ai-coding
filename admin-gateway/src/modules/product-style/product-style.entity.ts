import { ObjectType, Field, Int } from '@nestjs/graphql';
import { BaseEntity } from '../common.schema';

@ObjectType()
export class ProductStyle extends BaseEntity {
  @Field(() => Int)
  id: number;

  @Field()
  name: string;

  @Field({ nullable: true })
  description: string;

  @Field()
  isActive: boolean;
}