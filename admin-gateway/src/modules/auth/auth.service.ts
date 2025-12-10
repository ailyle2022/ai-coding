import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthPayload, AuthUser } from './auth.payload';
import { User } from '../user/user.entity';
import { PasswordService } from '../common/password.service';

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
    // 简化版token生成，实际应使用JWT库
    // 这里仅为演示目的，不应在生产环境中使用
    const payload = {
      sub: user.id,
      username: user.username,
      roles: user.roles?.map((role) => role.name) || [],
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24, // 24小时过期
    };

    // 简单的Base64编码作为示例，实际应使用JWT签名
    return Buffer.from(JSON.stringify(payload)).toString('base64');
  }
}
