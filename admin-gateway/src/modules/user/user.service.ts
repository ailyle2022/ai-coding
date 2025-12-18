import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { Role } from '../role/role.entity';
import { PasswordService } from '../common/password.service';

// 定义用户输入类型
export interface CreateUserInput {
  username: string;
  password: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  isActive?: boolean;
  roleIds?: number[]; // 添加角色ID数组
}

export interface UpdateUserInput {
  username?: string;
  password?: string; // 添加可选密码字段
  email?: string;
  firstName?: string;
  lastName?: string;
  isActive?: boolean;
  roleIds?: number[]; // 添加角色ID数组
}

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    private readonly passwordService: PasswordService,
  ) {}

  /**
   * 查询所有用户
   * @returns 用户列表
   */
  async findAll(): Promise<User[]> {
    return await this.userRepository.find({
      select: [
        'id',
        'username',
        'email',
        'firstName',
        'lastName',
        'isActive',
        'mfaEnabled', // 添加mfaEnabled字段
        'createdAt',
        'updatedAt',
      ],
      relations: ['roles'], // 包含角色关系
      order: { id: 'ASC' },
    });
  }

  /**
   * 根据ID查询用户
   * @param id 用户ID
   * @returns 用户信息
   */
  async findById(id: number): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
      select: [
        'id',
        'username',
        'email',
        'firstName',
        'lastName',
        'isActive',
        'mfaEnabled', // 添加mfaEnabled字段
        'createdAt',
        'updatedAt',
      ],
      relations: ['roles'], // 包含角色关系
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }

  /**
   * 创建新用户
   * @param input 创建用户输入
   * @returns 创建的用户
   */
  async create(input: CreateUserInput): Promise<User> {
    // 检查用户名是否已存在
    const existingUser = await this.userRepository.findOne({
      where: { username: input.username },
    });

    if (existingUser) {
      throw new ConflictException(
        `User with username ${input.username} already exists`,
      );
    }

    // 检查邮箱是否已存在（如果提供了邮箱）
    if (input.email) {
      const existingEmailUser = await this.userRepository.findOne({
        where: { email: input.email },
      });

      if (existingEmailUser) {
        throw new ConflictException(
          `User with email ${input.email} already exists`,
        );
      }
    }

    // 创建新用户
    const user = new User();
    user.username = input.username;
    user.email = input.email;
    user.firstName = input.firstName;
    user.lastName = input.lastName;
    user.isActive = input.isActive !== undefined ? input.isActive : true; // 默认为true

    // 对密码进行哈希处理
    user.passwordHash = await this.passwordService.hashPassword(input.password);

    // 处理角色分配
    if (input.roleIds && input.roleIds.length > 0) {
      const roles = await this.roleRepository.findByIds(input.roleIds);
      user.roles = roles;
    } else {
      user.roles = []; // 没有指定角色则设为空数组
    }

    // 保存用户
    return await this.userRepository.save(user);
  }

  /**
   * 更新用户
   * @param id 用户ID
   * @param input 更新用户输入
   * @returns 更新后的用户
   */
  async update(id: number, input: UpdateUserInput): Promise<User> {
    const user = await this.findById(id);

    // 检查用户名是否已存在（如果提供了新用户名）
    if (input.username && input.username !== user.username) {
      const existingUser = await this.userRepository.findOne({
        where: { username: input.username },
      });

      if (existingUser) {
        throw new ConflictException(
          `User with username ${input.username} already exists`,
        );
      }
      user.username = input.username;
    }

    // 检查邮箱是否已存在（如果提供了新邮箱）
    if (input.email && input.email !== user.email) {
      const existingEmailUser = await this.userRepository.findOne({
        where: { email: input.email },
      });

      if (existingEmailUser) {
        throw new ConflictException(
          `User with email ${input.email} already exists`,
        );
      }
      user.email = input.email;
    }

    // 更新密码（如果提供了新密码）
    if (input.password) {
      user.passwordHash = await this.passwordService.hashPassword(input.password);
    }

    // 更新其他字段
    if (input.firstName !== undefined) user.firstName = input.firstName;
    if (input.lastName !== undefined) user.lastName = input.lastName;
    if (input.isActive !== undefined) user.isActive = input.isActive;

    // 处理角色更新
    if (input.roleIds !== undefined) {
      // 注意这里检查的是undefined，允许传入空数组
      if (input.roleIds.length > 0) {
        const roles = await this.roleRepository.findByIds(input.roleIds);
        user.roles = roles;
      } else {
        user.roles = []; // 清空角色
      }
    }

    // 保存更新后的用户
    return await this.userRepository.save(user);
  }

  /**
   * 删除用户
   * @param id 用户ID
   * @returns 是否删除成功
   */
  async delete(id: number): Promise<boolean> {
    const user = await this.findById(id);
    await this.userRepository.remove(user);
    return true;
  }
}