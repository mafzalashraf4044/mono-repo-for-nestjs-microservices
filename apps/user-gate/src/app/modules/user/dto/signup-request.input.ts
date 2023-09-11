import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, Matches, MaxLength } from 'class-validator';

import { PASSWORD_REGEX, USERNAME_REGEX } from '@common/constants';
import { IsMultiRegionPhoneNumber } from '@common/utils';

@InputType()
class SignupRequest {
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
  @Matches(USERNAME_REGEX)
  @IsNotEmpty()
  username: string;

  @Field()
  @MaxLength(100)
  @Matches(PASSWORD_REGEX)
  @IsNotEmpty()
  password: string;

  @Field()
  @MaxLength(50)
  country: string;

  @Field()
  @IsMultiRegionPhoneNumber(['US', 'GB'])
  phone: string;
}

export default SignupRequest;
