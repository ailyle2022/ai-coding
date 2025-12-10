import { gql } from 'graphql-tag';

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