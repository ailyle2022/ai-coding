import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { AuthService, LoginInput } from './auth.service';
import { AuthPayload } from './auth.payload';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => AuthPayload)
  async login(@Args('input') loginInput: LoginInput): Promise<AuthPayload> {
    return this.authService.login(loginInput);
  }
}