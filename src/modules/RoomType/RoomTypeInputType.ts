import { InputType, Field } from 'type-graphql';

@InputType()
export class RoomTypeInput {
  @Field()
  roomTypeId?: number;

  @Field()
  name?: string;

  @Field()
  abbr?: string;

  @Field()
  description?: string;
} 
