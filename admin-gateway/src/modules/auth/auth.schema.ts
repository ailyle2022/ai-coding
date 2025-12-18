import { gql } from 'graphql-tag';

export const authTypeDefs = gql`
  type AuthUser {
    id: Int!
    username: String!
  }

  type User {
    id: Int!
    username: String!
    email: String
    firstName: String
    lastName: String
    isActive: Boolean!
    mfaEnabled: Boolean
    createdAt: String!
    updatedAt: String!
  }

  type AuthPayload {
    token: String!
    user: AuthUser
    isSuccess: Boolean!
    message: String
    mfaChallengeId: String
  }

  type ChangePasswordPayload {
    isSuccess: Boolean!
    message: String
  }

  input LoginInput {
    username: String!
    password: String!
  }

  input MFAVerifyInput {
    mfaChallengeId: String!
    mfaCode: String!
  }

  type MFAEnableResult {
    secret: String!
    uri: String!
  }

  type MFASetupResult {
    secret: String!
    uri: String!
    mfaChallengeId: String!
  }

  type Query {
    authPlaceholder: Boolean
    getCurrentUser: User
  }

  type Mutation {
    login(input: LoginInput!): AuthPayload!
    verifyMFA(input: MFAVerifyInput!): AuthPayload!
    changePassword(currentPassword: String!, newPassword: String!): ChangePasswordPayload!
    enableMFA(userId: Int!): MFAEnableResult!
    disableMFA(userId: Int!): Boolean!
    setupMFA(userId: Int!): MFASetupResult!
    confirmMFA(input: MFAVerifyInput!): AuthPayload!
  }
`;