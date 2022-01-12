import { InputType, Field } from 'type-graphql';

@InputType()
export class RoomStatusInput {
  @Field()
  roomStatusId?: number;

  @Field()
  name?: string;

  @Field()
  abbr?: string;

  @Field()
  description?: string;

  @Field(() => String, { nullable: true })
  color?: string | null;
} 
