import { gql } from 'graphql-tag';

export const authTypeDefs = gql`
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

  type Query {
    _: Boolean
  }

  type Mutation {
    login(input: LoginInput!): AuthPayload!
  }
`;

export const typeDefs = gql`
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

  type Query {
    users: [User!]!
    user(id: Int!): User
    roles: [Role!]!
  }

  type Mutation {
    createRole(input: CreateRoleInput!): Role!
  }
`;
