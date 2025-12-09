import { gql } from 'graphql-tag';

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
    users: [User!]!
    user(id: Int!): User
    roles: [Role!]!
  }

  type Mutation {
    login(input: LoginInput!): AuthPayload!
    createRole(input: CreateRoleInput!): Role!
  }
`;