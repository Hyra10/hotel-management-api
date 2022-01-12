import { InputType, Field } from 'type-graphql';

@InputType()
export class HotelInput {
  @Field()
  hotelId?: number;

  @Field()
  name?: string;
  
  @Field()
  description?: string;
} 