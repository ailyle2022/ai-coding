import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class AuthUser {
  @Field(() => Int)
  id: number;

  @Field()
  username: string;
}

@ObjectType()
export class AuthPayload {
  @Field()
  token: string;

  @Field(() => AuthUser, { nullable: true })
  user: AuthUser;

  @Field()
  isSuccess: boolean;

  @Field({ nullable: true })
  message: string;
  
  @Field({ nullable: true })
  mfaChallengeId: string;
}