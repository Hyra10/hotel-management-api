import { InputType, Field } from 'type-graphql';

@InputType()
export class ServiceStatusInput {
  @Field()
  serviceStatusId?: number;

  @Field()
  name?: string;

  @Field()
  abbr?: string;

  @Field()
  description?: string;
} 