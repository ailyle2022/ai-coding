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
  }

  type Mutation {
    login(input: LoginInput!): AuthPayload!
  }
`;