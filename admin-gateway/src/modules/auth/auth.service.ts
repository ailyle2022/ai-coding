import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthPayload, AuthUser } from './auth.payload';
import { User } from '../user/user.entity';
import { PasswordService } from '../common/password.service';
import { CacheService } from '../common/cache.service';
import { RabbitMQService } from '../common/rabbitmq.service';
import * as crypto from 'crypto';
import * as speakeasy from 'speakeasy';
import { CONTEXT } from '@nestjs/graphql';
import { GqlExecutionContext } from '@nestjs/graphql';

export interface LoginInput {
  username: string;
  password: string;
}

export interface MFAVerifyInput {
  mfaChallengeId: string;
  mfaCode: string;
}

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly passwordService: PasswordService,
    private readonly cacheService: CacheService,
    private readonly rabbitMQService: RabbitMQService,
    @Inject(CONTEXT) private context: any,
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

      // 检查用户是否启用了MFA
      if (user.mfaEnabled && user.mfaSecret) {
        // 如果启用了MFA，生成MFA挑战
        const mfaChallengeId = await this.generateMFAChallenge(user.id);

        // 返回MFA挑战ID
        authPayload.isSuccess = false;
        authPayload.message = 'MFA_REQUIRED';
        authPayload.mfaChallengeId = mfaChallengeId;

        return authPayload;
      }

      // 如果没有启用MFA或者MFA密钥不存在，直接登录
      const token = this.generateToken(user);

      // 将token存储到Redis中
      await this.storeToken(token, user);

      // 构建返回的用户信息
      const authUser = new AuthUser();
      authUser.id = user.id;
      authUser.username = user.username;

      // 设置返回值
      authPayload.token = token;
      authPayload.user = authUser;
      authPayload.isSuccess = true;

      // 发布登录事件
      await this.rabbitMQService.publishEvent('helloEvent', {
        userId: user.id,
        username: user.username,
        loginTime: new Date(),
      });

      return authPayload;
    } catch (error) {
      // 处理数据库错误
      authPayload.isSuccess = false;
      authPayload.message = 'Internal server error';
      return authPayload;
    }
  }

  async verifyMFA(mfaVerifyInput: MFAVerifyInput): Promise<AuthPayload> {
    const authPayload = new AuthPayload();
    authPayload.token = '';

    try {
      // 获取MFA挑战信息
      const challengeKey = `mfa_challenge_${mfaVerifyInput.mfaChallengeId}`;
      const challengeData = await this.cacheService.redisClient.get(challengeKey);

      if (!challengeData) {
        authPayload.isSuccess = false;
        authPayload.message = 'Invalid or expired MFA challenge';
        return authPayload;
      }

      const challenge = JSON.parse(challengeData.toString());
      const user = await this.userRepository.findOne({
        where: { id: challenge.userId, isActive: true },
        relations: ['roles'],
      });

      if (!user) {
        authPayload.isSuccess = false;
        authPayload.message = 'User not found';
        return authPayload;
      }

      // 验证MFA代码
      const isValid = speakeasy.totp.verify({
        secret: user.mfaSecret,
        encoding: 'base32',
        token: mfaVerifyInput.mfaCode,
        window: 2, // Allow a 2-step window for time drift
      });

      if (!isValid) {
        authPayload.isSuccess = false;
        authPayload.message = 'Invalid MFA code';
        return authPayload;
      }

      // 删除已使用的挑战
      await this.cacheService.redisClient.del(challengeKey);

      // 生成JWT令牌
      const token = this.generateToken(user);

      // 将token存储到Redis中
      await this.storeToken(token, user);

      // 构建返回的用户信息
      const authUser = new AuthUser();
      authUser.id = user.id;
      authUser.username = user.username;

      // 设置返回值
      authPayload.token = token;
      authPayload.user = authUser;
      authPayload.isSuccess = true;

      // 发布登录事件
      await this.rabbitMQService.publishEvent('helloEvent', {
        userId: user.id,
        username: user.username,
        loginTime: new Date(),
      });

      return authPayload;
    } catch (error) {
      authPayload.isSuccess = false;
      authPayload.message = 'Internal server error';
      return authPayload;
    }
  }

  async changePassword(currentPassword: string, newPassword: string): Promise<{isSuccess: boolean, message: string}> {
    try {
      // 检查context对象是否存在
      if (!this.context) {
        return {
          isSuccess: false,
          message: 'GraphQL context not available'
        };
      }

      // 从GraphQL上下文中获取当前用户ID
      const userId = this.context.req?.userId || (this.context.req?.user && this.context.req.user.userId);
      if (!userId) {
        return {
          isSuccess: false,
          message: 'User not authenticated'
        };
      }

      // 查找用户
      const user = await this.userRepository.findOne({ where: { id: userId } });
      if (!user) {
        return {
          isSuccess: false,
          message: 'User not found'
        };
      }

      // 验证当前密码
      const isValid = await this.passwordService.comparePassword(currentPassword, user.passwordHash);
      if (!isValid) {
        return {
          isSuccess: false,
          message: 'Current password is incorrect'
        };
      }

      // 更新密码
      user.passwordHash = await this.passwordService.hashPassword(newPassword);
      await this.userRepository.save(user);

      return {
        isSuccess: true,
        message: 'Password changed successfully'
      };
    } catch (error) {
      // 发生任何错误都返回false
      return {
        isSuccess: false,
        message: 'An error occurred while changing password: ' + error.message
      };
    }
  }

  async getCurrentUser(): Promise<User | undefined> {
    // 从GraphQL上下文中获取当前用户ID
    const userId = this.context.req?.userId || (this.context.req?.user && this.context.req.user.userId);
    if (!userId) {
      return undefined;
    }

    // 查找用户
    return await this.userRepository.findOne({ 
      where: { id: userId },
      relations: ['roles']
    });
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
      roles: user.roles?.map((role) => role.name) || [],
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

  /**
   * 生成MFA挑战
   * @param userId 用户ID
   * @param secret MFA密钥 (可选)
   * @returns 挑战ID
   */
  private async generateMFAChallenge(userId: number, secret?: string): Promise<string> {
    const challengeId = crypto.randomBytes(32).toString('hex');
    const challengeKey = `mfa_challenge_${challengeId}`;
    const challengeData = {
      userId,
      timestamp: Date.now(),
      secret // 添加secret到挑战数据中，用于setupMFA流程
    };

    // 存储挑战信息，5分钟过期
    await this.cacheService.redisClient.setEx(
      challengeKey,
      300,
      JSON.stringify(challengeData),
    );

    return challengeId;
  }

  /**
   * 为用户启用MFA（管理员功能）
   * @param userId 用户ID
   * @returns MFA密钥
   */
  async enableMFA(userId: number): Promise<{secret: string, uri: string}> {
    // 生成MFA密钥
    const secret = speakeasy.generateSecret({
      name: `AdminGateway:${userId}`,
      issuer: 'AdminGateway',
    });
    
    // 更新用户记录
    await this.userRepository.update(userId, {
      mfaEnabled: true,
      mfaSecret: secret.base32,
    });
    
    return {
      secret: secret.base32,
      uri: secret.otpauth_url,
    };
  }

  /**
   * 为用户禁用MFA（管理员功能）
   * @param userId 用户ID
   */
  async disableMFA(userId: number): Promise<void> {
    await this.userRepository.update(userId, {
      mfaEnabled: false,
      mfaSecret: null,
    });
  }

  /**
   * 为用户设置MFA（用户自助设置功能）
   * @param userId 用户ID
   * @returns MFA密钥和挑战ID
   */
  async setupMFA(userId: number): Promise<{secret: string, uri: string, mfaChallengeId: string}> {
    // 生成MFA密钥
    const secret = speakeasy.generateSecret({
      name: `AdminGateway:${userId}`,
      issuer: 'AdminGateway',
    });
    
    // 生成MFA挑战ID，并将secret存储在挑战数据中
    const mfaChallengeId = await this.generateMFAChallenge(userId, secret.base32);
    
    return {
      secret: secret.base32,
      uri: secret.otpauth_url,
      mfaChallengeId: mfaChallengeId
    };
  }

  /**
   * 验证并完成MFA设置
   * @param mfaVerifyInput MFA验证输入
   * @returns 验证结果
   */
  async confirmMFA(mfaVerifyInput: MFAVerifyInput): Promise<AuthPayload> {
    const authPayload = new AuthPayload();
    authPayload.token = '';

    try {
      // 获取MFA挑战信息
      const challengeKey = `mfa_challenge_${mfaVerifyInput.mfaChallengeId}`;
      const challengeData = await this.cacheService.redisClient.get(challengeKey);

      if (!challengeData) {
        authPayload.isSuccess = false;
        authPayload.message = 'Invalid or expired MFA challenge';
        return authPayload;
      }

      const challenge = JSON.parse(challengeData.toString());
      const user = await this.userRepository.findOne({
        where: { id: challenge.userId, isActive: true },
        relations: ['roles'],
      });

      if (!user) {
        authPayload.isSuccess = false;
        authPayload.message = 'User not found';
        return authPayload;
      }

      // 验证MFA代码，必须使用挑战中存储的secret
      const isValid = speakeasy.totp.verify({
        secret: challenge.secret, // 现在可以从挑战数据中获取secret
        encoding: 'base32',
        token: mfaVerifyInput.mfaCode,
        window: 2, // Allow a 2-step window for time drift
      });

      if (!isValid) {
        authPayload.isSuccess = false;
        authPayload.message = 'Invalid MFA code';
        return authPayload;
      }

      // 删除已使用的挑战
      await this.cacheService.redisClient.del(challengeKey);

      // 启用用户的MFA并保存密钥
      await this.userRepository.update(user.id, {
        mfaEnabled: true,
        mfaSecret: challenge.secret,
      });

      // 构建返回的用户信息
      const authUser = new AuthUser();
      authUser.id = user.id;
      authUser.username = user.username;

      // 设置返回值
      authPayload.user = authUser;
      authPayload.isSuccess = true;
      authPayload.message = 'MFA setup completed successfully';

      return authPayload;
    } catch (error) {
      authPayload.isSuccess = false;
      authPayload.message = 'Internal server error';
      return authPayload;
    }
  }
}