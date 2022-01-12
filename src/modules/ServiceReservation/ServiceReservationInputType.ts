import { InputType, Field } from 'type-graphql';

@InputType()
export class ServiceReservationInput {
  @Field()
  serviceReservationId?: number;

  @Field()
  startDate?: Date;

  @Field()
  endDate?: Date;

  @Field(() => String, { nullable: true })
  serviceSubtype?: string | null;

  @Field(() => String, { nullable: true })
  clientNotes?: string | null;

  @Field(() => String, { nullable: true })
  staffNotes?: string | null;

  @Field({ defaultValue: false })
  areThereChildren?: boolean;

  @Field(() => [Number])
  clientId?: Array<number>;

  @Field()
  serviceStatusId?: number;

  @Field()
  serviceId?: number;
} 
