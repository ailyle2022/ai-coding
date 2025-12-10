import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { UserResolver } from './user.resolver';
import { User } from './user.entity';
import { CommonModule } from '../common/common.module';
import { RoleModule } from '../role/role.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), CommonModule, RoleModule],
  providers: [UserService, UserResolver],
  exports: [UserService, TypeOrmModule],
})
export class UserModule {}