/** @format */

import { Field, InputType } from '@nestjs/graphql';
import { MaxLength, IsEmail, IsNotEmpty } from 'class-validator';

@InputType()
class CreateUserInput {
  @Field()
  @MaxLength(50)
  @IsNotEmpty()
  firstName: string;

  @Field()
  @MaxLength(50)
  @IsNotEmpty()
  lastName: string;

  @Field()
  @MaxLength(100)
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @Field()
  @MaxLength(100)
  @IsEmail()
  @IsNotEmpty()
  username: string;

  @Field()
  @MaxLength(100)
  @IsNotEmpty()
  password: string;

  @Field()
  @MaxLength(50)
  country: string;
}

export default CreateUserInput;
