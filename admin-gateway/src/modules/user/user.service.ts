import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  /**
   * 查询所有用户
   * @returns 用户列表
   */
  async findAll(): Promise<User[]> {
    return await this.userRepository.find({
      select: ['id', 'username', 'email', 'firstName', 'lastName', 'isActive', 'createdAt', 'updatedAt'],
      order: { id: 'ASC' }
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
      select: ['id', 'username', 'email', 'firstName', 'lastName', 'isActive', 'createdAt', 'updatedAt']
    });
    
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    
    return user;
  }
}