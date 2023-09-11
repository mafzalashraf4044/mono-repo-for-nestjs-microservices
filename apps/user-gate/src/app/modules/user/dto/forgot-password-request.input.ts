/** @format */

import { Field, InputType } from '@nestjs/graphql';
import { MaxLength, IsEmail, IsNotEmpty } from 'class-validator';

@InputType()
class ForgotPasswordRequest {
  @Field()
  @MaxLength(100)
  @IsEmail()
  @IsNotEmpty()
  email: string;
}

export default ForgotPasswordRequest;
