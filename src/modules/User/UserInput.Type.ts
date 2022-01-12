import { InputType, Field } from 'type-graphql';

@InputType()
export class UserInput {
  @Field()
  userId?: number;

  @Field()
  userName?: string;

  @Field()
  email?: string;

  @Field()
  userRoleId?: number;
} 