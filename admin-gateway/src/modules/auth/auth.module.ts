import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { print } from 'graphql';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';
import { PasswordService } from './password.service';
import { typeDefs } from './auth.schema';
import { User } from './user.entity';
import { Role } from './role.entity';
import { Session } from './session.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Role, Session]),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      typeDefs: typeof typeDefs === 'string' ? typeDefs : print(typeDefs),
      playground: true,
    }),
  ],
  providers: [AuthResolver, AuthService, PasswordService],
  exports: [TypeOrmModule, PasswordService],
})
export class AuthModule {}