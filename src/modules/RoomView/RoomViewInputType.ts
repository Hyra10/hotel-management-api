import { InputType, Field } from 'type-graphql';

@InputType()
export class RoomViewInput {
  @Field()
  roomViewId?: number;

  @Field()
  name?: string;

  @Field()
  abbr?: string;

  @Field()
  description?: string;
} 
