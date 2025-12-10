import { gql } from 'graphql-tag';

export const userTypeDefs = gql`
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