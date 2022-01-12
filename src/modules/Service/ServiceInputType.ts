import { InputType, Field } from 'type-graphql';

@InputType()
export class ServiceInput {
  @Field()
  serviceId?: number;

  @Field()
  name?: string;

  @Field()
  observation?: string;

  @Field()
  hotelId: number;
} 
