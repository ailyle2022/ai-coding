import { Resolver, Mutation, Args, Query, Int } from '@nestjs/graphql';
import { AuthService, LoginInput, MFAVerifyInput } from './auth.service';
import { UserService } from '../user/user.service';
import { RoleService, CreateRoleInput } from '../role/role.service';
import { AuthPayload, ChangePasswordPayload } from './auth.payload';
import { User } from '../user/user.entity';
import { Role } from '../role/role.entity';

@Resolver()
export class AuthResolver {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly roleService: RoleService,
  ) {}

  @Mutation(() => AuthPayload)
  async login(@Args('input') loginInput: LoginInput): Promise<AuthPayload> {
    return this.authService.login(loginInput);
  }

  @Mutation(() => AuthPayload)
  async verifyMFA(@Args('input') mfaVerifyInput: MFAVerifyInput): Promise<AuthPayload> {
    return this.authService.verifyMFA(mfaVerifyInput);
  }

  @Mutation(() => ChangePasswordPayload)
  async changePassword(
    @Args('currentPassword') currentPassword: string,
    @Args('newPassword') newPassword: string
  ): Promise<{isSuccess: boolean, message: string}> {
    return this.authService.changePassword(currentPassword, newPassword);
  }

  @Mutation(() => Object)
  async enableMFA(@Args('userId', { type: () => Int }) userId: number): Promise<{secret: string, uri: string}> {
    return this.authService.enableMFA(userId);
  }

  @Mutation(() => Boolean)
  async disableMFA(@Args('userId', { type: () => Int }) userId: number): Promise<boolean> {
    await this.authService.disableMFA(userId);
    return true;
  }

  @Mutation(() => Object)
  async setupMFA(@Args('userId', { type: () => Int }) userId: number): Promise<{secret: string, uri: string, mfaChallengeId: string}> {
    return this.authService.setupMFA(userId);
  }

  @Mutation(() => AuthPayload)
  async confirmMFA(@Args('input') mfaVerifyInput: MFAVerifyInput): Promise<AuthPayload> {
    return this.authService.confirmMFA(mfaVerifyInput);
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