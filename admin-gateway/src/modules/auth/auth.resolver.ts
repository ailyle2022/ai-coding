import { Resolver, Mutation, Args, Query, Int } from '@nestjs/graphql';
import { AuthService, LoginInput, CreateRoleInput } from './auth.service';
import { AuthPayload } from './auth.payload';
import { User } from './user.entity';
import { Role } from './role.entity';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => AuthPayload)
  async login(@Args('input') loginInput: LoginInput): Promise<AuthPayload> {
    return this.authService.login(loginInput);
  }

  @Query(() => [User])
  async users(): Promise<User[]> {
    return this.authService.findAllUsers();
  }

  @Query(() => User, { nullable: true })
  async user(@Args('id', { type: () => Int }) id: number): Promise<User> {
    return this.authService.findUserById(id);
  }

  @Query(() => [Role])
  async roles(): Promise<Role[]> {
    return this.authService.findAllRoles();
  }

  @Mutation(() => Role)
  async createRole(@Args('input') input: CreateRoleInput): Promise<Role> {
    return this.authService.createRole(input);
  }
}