import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { AuthService, LoginInput } from './auth.service';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => 'AuthPayload')
  async login(@Args('input') loginInput: LoginInput): Promise<any> {
    return this.authService.login(loginInput);
  }
}