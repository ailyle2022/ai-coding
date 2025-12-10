import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { print, concatAST } from 'graphql';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';
import { PasswordService } from '../common/password.service';
import { authTypeDefs } from './auth.schema';
import { UserModule } from '../user/user.module';
import { RoleModule } from '../role/role.module';
import { userTypeDefs } from '../user/user.schema';
import { roleTypeDefs } from '../role/role.schema';
import { commonTypeDefs } from '../common.schema';
import { CommonModule } from '../common/common.module';

@Module({
  imports: [
    CommonModule,
    UserModule,
    RoleModule,
    TypeOrmModule.forFeature([]),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      typeDefs: print(
        concatAST([commonTypeDefs, authTypeDefs, userTypeDefs, roleTypeDefs]),
      ),
      playground: true,
    }),
  ],
  providers: [AuthResolver, AuthService],
  exports: [TypeOrmModule],
})
export class AuthModule {}
