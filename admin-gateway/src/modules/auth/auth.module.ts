import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { print } from 'graphql';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';
import { typeDefs } from './auth.schema';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      typeDefs: typeof typeDefs === 'string' ? typeDefs : print(typeDefs),
      playground: true,
    }),
  ],
  providers: [AuthResolver, AuthService],
})
export class AuthModule {}