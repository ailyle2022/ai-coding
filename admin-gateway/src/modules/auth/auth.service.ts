import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthPayload, AuthUser } from './auth.payload';
import { User } from '../user/user.entity';
import { PasswordService } from '../common/password.service';
import { CacheService } from '../common/cache.service';
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
    private readonly cacheService: CacheService,
  ) {
  }

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

      // 将token存储到Redis中，key为session_<token>，有效期2小时
      await this.storeToken(token, user);

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

  private generateToken(user: User): string {
    // 使用MD5生成基于用户信息和时间戳的token
    const data = `${user.id}${user.username}${Date.now()}${Math.random()}`;
    return crypto.createHash('md5').update(data).digest('hex');
  }

    /**
   * 将token存储到Redis中，key为session_<token>，有效期2小时
   * @param token 会话token
   * @param user 用户信息
   */
  async storeToken(token: string, user: User): Promise<void> {
    const key = `session_${token}`;
    const value = JSON.stringify({
      userId: user.id,
      username: user.username,
      roles: user.roles?.map(role => role.name) || []
    });
    
    // 存储到Redis，设置过期时间为2小时（7200秒）
    await this.cacheService.redisClient.setEx(key, 7200, value);
  }

  /**
   * 根据token获取用户会话信息
   * @param token 会话token
   * @returns 用户会话信息
   */
  async getUserSession(token: string): Promise<any> {
    const key = `session_${token}`;
    const value = await this.cacheService.redisClient.get(key);
    return value ? JSON.parse(value.toString()) : null;
  }

  /**
   * 删除用户会话
   * @param token 会话token
   */
  async removeToken(token: string): Promise<void> {
    const key = `session_${token}`;
    await this.cacheService.redisClient.del(key);
  }

}