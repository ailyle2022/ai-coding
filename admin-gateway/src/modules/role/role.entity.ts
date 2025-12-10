import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToMany } from 'typeorm';
import { ObjectType, Field, Int } from '@nestjs/graphql';
import { User } from '../user/user.entity';

@ObjectType()
@Entity('roles')
export class Role {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column({ unique: true, length: 50 })
  name: string;

  @Field({ nullable: true })
  @Column({ type: 'text', nullable: true })
  description: string;

  @Field()
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ManyToMany(() => User, user => user.roles)
  users: User[];
}