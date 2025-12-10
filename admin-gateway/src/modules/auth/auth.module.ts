import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { print } from 'graphql';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';
import { PasswordService } from './password.service';
import { typeDefs } from './auth.schema';
import { UserModule } from '../user/user.module';
import { RoleModule } from '../role/role.module';

@Module({
  imports: [
    UserModule,
    RoleModule,
    TypeOrmModule.forFeature([]),
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