import { gql } from 'graphql-tag';

export const productStyleSchema = gql`
  type ProductStyle {
    id: Int!
    name: String!
    description: String
    isActive: Boolean!
    createdAt: String!
    updatedAt: String!
  }

  input CreateProductStyleInput {
    name: String!
    description: String
    isActive: Boolean
  }

  input UpdateProductStyleInput {
    description: String
    isActive: Boolean
  }

  extend type Query {
    productStyles: [ProductStyle!]!
    productStyle(id: Int!): ProductStyle
  }

  extend type Mutation {
    createProductStyle(input: CreateProductStyleInput!): ProductStyle!
    updateProductStyle(id: Int!, input: UpdateProductStyleInput!): ProductStyle!
    deleteProductStyle(id: Int!): Boolean!
  }
`;