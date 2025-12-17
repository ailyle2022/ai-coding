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
  }

  input UpdateUserInput {
    username: String
    email: String
    firstName: String
    lastName: String
    isActive: Boolean
  }
  
  type AuthUser {
    id: Int!
    username: String!
  }
  
  type AuthPayload {
    token: String!
    user: AuthUser
    isSuccess: Boolean!
    message: String
  }

  input LoginInput {
    username: String!
    password: String!
  }
  
  type Query {
    _: Boolean
  }
  
  type Mutation {
    _: Boolean
  }
`;