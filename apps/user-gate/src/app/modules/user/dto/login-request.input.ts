import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, IsString, MaxLength } from 'class-validator';

@InputType()
class LoginRequest {
  @Field()
  @IsEmail()
  @MaxLength(100)
  @IsNotEmpty()
  email: string;

  @Field()
  @IsString()
  @MaxLength(100)
  @IsNotEmpty()
  password: string;
}

export default LoginRequest;
