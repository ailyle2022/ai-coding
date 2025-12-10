import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from './role.entity';

export interface CreateRoleInput {
  name: string;
  description?: string;
}

export interface UpdateRoleInput {
  name?: string;
  description?: string;
}

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}

  /**
   * 查询所有角色
   * @returns 角色列表
   */
  async findAll(): Promise<Role[]> {
    return await this.roleRepository.find({
      select: ['id', 'name', 'description', 'createdAt'],
      order: { id: 'ASC' }
    });
  }

  /**
   * 创建新角色
   * @param input 创建角色的输入数据
   * @returns 创建的角色
   */
  async create(input: CreateRoleInput): Promise<Role> {
    // 检查角色名称是否为空
    if (!input.name || input.name.trim() === '') {
      throw new BadRequestException('角色名称不能为空');
    }

    // 检查角色名称是否已存在
    const existingRole = await this.roleRepository.findOne({
      where: { name: input.name }
    });

    if (existingRole) {
      throw new ConflictException('角色名称已存在');
    }

    // 创建新角色
    const role = new Role();
    role.name = input.name.trim();
    role.description = input.description?.trim() || null;
    
    // 保存角色
    return await this.roleRepository.save(role);
  }

  /**
   * 更新角色
   * @param id 角色ID
   * @param input 更新角色的输入数据
   * @returns 更新后的角色
   */
  async update(id: number, input: UpdateRoleInput): Promise<Role> {
    const role = await this.roleRepository.findOne({
      where: { id }
    });

    if (!role) {
      throw new NotFoundException(`角色ID ${id} 不存在`);
    }

    // 如果提供了新名称且与当前名称不同，则检查是否已存在
    if (input.name && input.name !== role.name) {
      // 检查新名称是否为空
      if (input.name.trim() === '') {
        throw new BadRequestException('角色名称不能为空');
      }

      // 检查新名称是否已存在
      const existingRole = await this.roleRepository.findOne({
        where: { name: input.name }
      });

      if (existingRole) {
        throw new ConflictException('角色名称已存在');
      }

      role.name = input.name.trim();
    }

    // 更新描述（如果提供了）
    if (input.description !== undefined) {
      role.description = input.description?.trim() || null;
    }

    // 保存更新后的角色
    return await this.roleRepository.save(role);
  }

  /**
   * 删除角色
   * @param id 角色ID
   * @returns 是否删除成功
   */
  async delete(id: number): Promise<boolean> {
    const role = await this.roleRepository.findOne({
      where: { id }
    });

    if (!role) {
      throw new NotFoundException(`角色ID ${id} 不存在`);
    }

    await this.roleRepository.remove(role);
    return true;
  }
}