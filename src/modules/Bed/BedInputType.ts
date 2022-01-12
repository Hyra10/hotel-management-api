import { InputType, Field } from 'type-graphql';

@InputType()
export class BedInput {
  @Field()
  bedId?: number;

  @Field()
  name?: string;

  @Field()
  abbr?: string;

  @Field()
  description?: string;
} 
