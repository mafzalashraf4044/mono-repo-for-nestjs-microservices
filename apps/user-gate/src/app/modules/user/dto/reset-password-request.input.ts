/** @format */

import { PASSWORD_REGEX } from '@common/constants';
import { Field, InputType } from '@nestjs/graphql';
import {
  MaxLength,
  IsEmail,
  IsNotEmpty,
  Length,
  Matches,
} from 'class-validator';

@InputType()
class ResetPasswordWithCodeRequest {
  @Field()
  @MaxLength(100)
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @Field()
  @Length(6, 6)
  @IsNotEmpty()
  code: string;

  @Field()
  @MaxLength(100)
  @Matches(PASSWORD_REGEX)
  @IsNotEmpty()
  password: string;

  @Field()
  @MaxLength(100)
  @Matches(PASSWORD_REGEX)
  @IsNotEmpty()
  confirmPassword: string;
}

export default ResetPasswordWithCodeRequest;
