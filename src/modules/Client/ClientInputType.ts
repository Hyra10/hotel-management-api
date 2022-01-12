import { InputType, Field } from 'type-graphql';
import { Min, Max } from 'class-validator';

@InputType()
export class ClientInput {
  @Field()
  clientId?: number;

  @Field()
  name?: string;

  @Field()
  firstSurname?: string;

  @Field()
  secondSurname?: string;

  @Field()
  cedula?: string;

  @Field()
  @Min(0)
  @Max(100)
  age?: number;

  @Field()
  phoneNumber?: string;

  @Field()
  nationality?: string;

  @Field(() => String, { nullable: true })
  observation?: string | null;

  @Field(() => String, { nullable: true })
  disability?: string | null;

  @Field(() => String, { nullable: true })
  alergic?: string | null;

  @Field()
  isLactoseIntolerant?: boolean;

  @Field()
  creditCardNumber?: string;

  @Field()
  cvc?: string;

  @Field()
  expiredDate?: Date;

  @Field()
  cardName?: string;

  @Field()
  hotelId: number;
}
