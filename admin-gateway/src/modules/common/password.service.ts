import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

/**
 * 密码服务类
 * 提供密码哈希和验证功能
 */
@Injectable()
export class PasswordService {
  /**
   * 生成密码哈希
   * @param password 明文密码
   * @returns 哈希后的密码
   */
  async hashPassword(password: string): Promise<string> {
    // 使用 bcrypt 生成密码哈希，使用 10 轮盐值
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
  }

  /**
   * 验证密码
   * @param plainPassword 明文密码
   * @param hashedPassword 哈希密码
   * @returns 是否匹配
   */
  async comparePassword(
    plainPassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    // 使用 bcrypt 比较明文密码和哈希密码
    return await bcrypt.compare(plainPassword, hashedPassword);
  }
}
