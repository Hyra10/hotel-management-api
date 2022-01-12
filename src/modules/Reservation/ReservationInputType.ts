
import { IsNumber } from 'class-validator';
import { InputType, Field } from 'type-graphql';

@InputType()
class RoomDates {
    @Field()
    roomId: number;

    @Field()
    startDate: Date;

    @Field()
    endDate: Date;
}

@InputType()
// @ArgsType()
export class ReservationInput {

  @IsNumber()
  @Field()
  clientId: number;

  @Field(() => [RoomDates])
  room: Array<RoomDates>;

  @Field()
  subtotal: number;

  @Field()
  tax: number;

  @Field()
  total: number;

  @Field()
  reservationStatusId: number;
} 

@InputType()
// @ArgsType()
export class UpdateReservationInput {

  @IsNumber()
  @Field()
  reservationId: number;

  @Field()
  reservationStatusId: number;
} 