import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { Role } from '../role/role.entity';

@ObjectType()
@Entity('users')
export class User {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column({ unique: true, length: 50 })
  username: string;

  @Column({ name: 'password_hash', length: 255 })
  passwordHash: string;

  @Field({ nullable: true })
  @Column({ unique: true, nullable: true, length: 100 })
  email: string;

  @Field({ nullable: true })
  @Column({ name: 'first_name', nullable: true, length: 50 })
  firstName: string;

  @Field({ nullable: true })
  @Column({ name: 'last_name', nullable: true, length: 50 })
  lastName: string;

  @Field()
  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @Field()
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @Field()
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Field(() => [Role], { nullable: true })
  @ManyToMany(() => Role)
  @JoinTable({
    name: 'user_roles',
    joinColumn: {
      name: 'user_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'role_id',
      referencedColumnName: 'id',
    },
  })
  roles: Role[];
  
  // MFA fields
  @Field({ nullable: true })
  @Column({ name: 'mfa_secret', nullable: true })
  mfaSecret: string;

  @Field({ nullable: true })
  @Column({ name: 'mfa_enabled', default: false })
  mfaEnabled: boolean;
}