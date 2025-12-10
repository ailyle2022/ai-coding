import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { RoleService, CreateRoleInput } from './role.service';
import { Role } from './role.entity';

@Resolver(() => Role)
export class RoleResolver {
  constructor(
    private readonly roleService: RoleService,
  ) {}

  @Query(() => [Role])
  async roles(): Promise<Role[]> {
    return this.roleService.findAll();
  }

  @Mutation(() => Role)
  async createRole(@Args('input') input: CreateRoleInput): Promise<Role> {
    return this.roleService.create(input);
  }
}