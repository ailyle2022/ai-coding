import { Resolver, Mutation, Args, Query, Int, Context } from '@nestjs/graphql';
import { AuthService, LoginInput, MFAVerifyInput } from './auth.service';
import { AuthPayload, ChangePasswordPayload } from './auth.payload';
import { User } from '../user/user.entity';

@Resolver()
export class AuthResolver {
  constructor(
    private readonly authService: AuthService,
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
    @Args('newPassword') newPassword: string,
    @Context() context: any,
  ): Promise<{isSuccess: boolean, message: string}> {
    // 将上下文注入到authService中
    Object.defineProperty(this.authService, 'context', {value: context, writable: true});
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

  @Query(() => User, { nullable: true })
  async getCurrentUser(@Context() context: any): Promise<User | undefined> {
    // 将上下文注入到authService中
    Object.defineProperty(this.authService, 'context', {value: context, writable: true});
    return this.authService.getCurrentUser();
  }

}