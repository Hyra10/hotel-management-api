import { InputType, Field } from 'type-graphql';
import { Length, IsEmail, MinLength } from 'class-validator';
import { IsEmailAlreadyExist } from './IsEmailAlreadyExist';

@InputType()
export class RegisterInputType {
  @Field()
  @Length(0, 50)
  userName: string;

  @Field()
  @IsEmail()
  @IsEmailAlreadyExist({ message: 'Email ya Existe' })
  email: string;

  @Field()
  @MinLength(3)
  password: string;

  @Field()
  profesorId: number;
}
