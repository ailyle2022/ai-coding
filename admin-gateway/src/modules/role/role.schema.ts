import { gql } from 'graphql-tag';

export const roleTypeDefs = gql`
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

  extend type Query {
    roles: [Role!]!
  }

  extend type Mutation {
    createRole(input: CreateRoleInput!): Role!
    updateRole(id: Int!, input: UpdateRoleInput!): Role!
    deleteRole(id: Int!): Boolean!
  }
`;