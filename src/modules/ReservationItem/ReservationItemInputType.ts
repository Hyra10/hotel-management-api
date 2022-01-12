import { InputType, Field } from 'type-graphql';

@InputType()
export class ReservationItemInput {
  @Field()
  reservationItemId?: number;

  @Field()
  reservationId?: number;

  @Field()
  name?: string;

  @Field()
  price?: number;
} 
