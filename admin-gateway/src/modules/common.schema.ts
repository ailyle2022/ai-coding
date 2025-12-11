import { gql } from 'graphql-tag';
import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class BaseEntity {
  @Field()
  createdAt: string;

  @Field()
  updatedAt: string;
}

export const commonTypeDefs = gql`
  type User {
    id: Int!
    username: String!
    email: String
    firstName: String
    lastName: String
    isActive: Boolean!
    createdAt: String!
    updatedAt: String!
    roles: [Role!]
  }

  type Role {
    id: Int!
    name: String!
    description: String
    createdAt: String!
  }

  input CreateRoleInput {
    name: String!
    description: String
  }

  input UpdateRoleInput {
    name: String
    description: String
  }

  input CreateUserInput {
    username: String!
    password: String!
    email: String
    firstName: String
    lastName: String
    isActive: Boolean
    roleIds: [Int!]
  }

  input UpdateUserInput {
    username: String
    email: String
    firstName: String
    lastName: String
    isActive: Boolean
    roleIds: [Int!]
  }

  type AuthPayload {
    token: String!
    user: User
    isSuccess: Boolean!
    message: String
  }

  input LoginInput {
    username: String!
    password: String!
  }
`;
