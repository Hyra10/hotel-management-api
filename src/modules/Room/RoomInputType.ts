import { InputType, Field } from 'type-graphql';

@InputType()
export class RoomInput {
  @Field()
  roomId?: number;

  @Field()
  roomNumber?: number;

  @Field()
  floorNumber?: number;

  @Field()
  buildingNumber?: number;

  @Field()
  price: number;

  @Field(() => [Number])
  beds: number[];

  @Field()
  roomType: number;

  @Field()
  roomView: number;

  @Field()
  roomStatus: number;

  @Field()
  allowHandicap?: boolean;

  @Field()
  observation?: string;

  @Field()
  hotelId: number;
}
