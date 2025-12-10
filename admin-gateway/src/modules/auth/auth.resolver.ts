import { Resolver, Mutation, Args, Query, Int } from '@nestjs/graphql';
import { AuthService, LoginInput } from './auth.service';
import { UserService } from '../user/user.service';
import { RoleService, CreateRoleInput } from '../role/role.service';
import { AuthPayload } from './auth.payload';
import { User } from '../user/user.entity';
import { Role } from '../role/role.entity';

@Resolver()
export class AuthResolver {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly roleService: RoleService
  ) {}

  @Mutation(() => AuthPayload)
  async login(@Args('input') loginInput: LoginInput): Promise<AuthPayload> {
    return this.authService.login(loginInput);
  }

  @Query(() => [User])
  async users(): Promise<User[]> {
    return this.userService.findAll();
  }

  @Query(() => User, { nullable: true })
  async user(@Args('id', { type: () => Int }) id: number): Promise<User> {
    return this.userService.findById(id);
  }

  @Query(() => [Role])
  async roles(): Promise<Role[]> {
    return this.roleService.findAll();
  }

  @Mutation(() => Role)
  async createRole(@Args('input') input: CreateRoleInput): Promise<Role> {
    return this.roleService.create(input);
  }
}