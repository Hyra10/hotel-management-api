import { InputType, Field } from 'type-graphql';
import { IsEmail, MinLength } from 'class-validator';

@InputType()
export class LoginInputType {
  @Field()
  @IsEmail()
  email: string;

  @Field()
  @MinLength(3, { message: 'password cannot have 3 caracters long' })
  password: string;
}
