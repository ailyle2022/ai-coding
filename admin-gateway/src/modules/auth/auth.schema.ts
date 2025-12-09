import { gql } from 'graphql-tag';

export const typeDefs = gql`
  type User {
    id: Int!
    username: String!
  }

  type AuthPayload {
    token: String!
    user: User!
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