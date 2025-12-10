import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { RoleService, CreateRoleInput, UpdateRoleInput } from './role.service';
import { Role } from './role.entity';

@Resolver(() => Role)
export class RoleResolver {
  constructor(private readonly roleService: RoleService) {}

  @Query(() => [Role])
  async roles(): Promise<Role[]> {
    return this.roleService.findAll();
  }

  @Mutation(() => Role)
  async createRole(@Args('input') input: CreateRoleInput): Promise<Role> {
    return this.roleService.create(input);
  }

  @Mutation(() => Role)
  async updateRole(
    @Args('id', { type: () => Int }) id: number,
    @Args('input') input: UpdateRoleInput,
  ): Promise<Role> {
    return this.roleService.update(id, input);
  }

  @Mutation(() => Boolean)
  async deleteRole(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<boolean> {
    return this.roleService.delete(id);
  }
}
