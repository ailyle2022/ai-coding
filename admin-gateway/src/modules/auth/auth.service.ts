import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthPayload, AuthUser } from './auth.payload';
import { User } from '../user/user.entity';
import { PasswordService } from '../common/password.service';
import * as crypto from 'crypto';

export interface LoginInput {
  username: string;
  password: string;
}

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly passwordService: PasswordService,
  ) {}

  async login(loginInput: LoginInput): Promise<AuthPayload> {
    const authPayload = new AuthPayload();
    authPayload.token = '';

    try {
      // 查找用户
      const user = await this.userRepository.findOne({
        where: { username: loginInput.username, isActive: true },
        relations: ['roles'],
      });

      // 如果用户不存在或密码不匹配
      if (
        !user ||
        !(await this.passwordService.comparePassword(
          loginInput.password,
          user.passwordHash,
        ))
      ) {
        authPayload.isSuccess = false;
        authPayload.message = 'Invalid credentials';
        return authPayload;
      }

      // 生成JWT令牌（这里简化处理，实际应使用JWT库生成）
      const token = this.generateToken(user);

      // 构建返回的用户信息
      const authUser = new AuthUser();
      authUser.id = user.id;
      authUser.username = user.username;

      // 设置返回值
      authPayload.token = token;
      authPayload.user = authUser;
      authPayload.isSuccess = true;

      return authPayload;
    } catch (error) {
      // 处理数据库错误
      authPayload.isSuccess = false;
      authPayload.message = 'Internal server error';
      return authPayload;
    }
  }

  /**
   * 用于生成密码哈希的方法，供后续注册新用户时使用
   * @param password 明文密码
   * @returns 哈希后的密码
   */
  async hashPasswordForStorage(password: string): Promise<string> {
    return await this.passwordService.hashPassword(password);
  }

  private generateToken(user: User): string {
    // 使用MD5生成基于用户信息和时间戳的token
    const data = `${user.id}${user.username}${Date.now()}${Math.random()}`;
    return crypto.createHash('md5').update(data).digest('hex');
  }
}
