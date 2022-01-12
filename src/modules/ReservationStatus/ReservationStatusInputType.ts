import { InputType, Field } from 'type-graphql';

@InputType()
export class ReservationStatusInput {
  @Field()
  reservationStatusId?: number;

  @Field()
  name?: string;

  @Field()
  abbr?: string;

  @Field()
  description?: string;
} 