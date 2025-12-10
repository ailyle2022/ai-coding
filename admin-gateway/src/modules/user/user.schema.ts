import { gql } from 'graphql-tag';

export const userTypeDefs = gql`
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

  extend type Query {
    users: [User!]!
    user(id: Int!): User
  }

  extend type Mutation {
    createUser(input: CreateUserInput!): User!
    updateUser(id: Int!, input: UpdateUserInput): User
    deleteUser(id: Int!): Boolean!
  }
`;