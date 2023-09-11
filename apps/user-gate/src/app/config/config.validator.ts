import { IsEnum, IsNumber, IsString, IsNotEmpty } from 'class-validator';

import { Environment } from '@swiq/common/enums';
import { EnvironmentVariablesInterface } from '@swiq/common/interfaces';

export default class EnvironmentVariables
  implements EnvironmentVariablesInterface
{
  @IsEnum(Environment)
  @IsNotEmpty()
  NODE_ENV: Environment;

  @IsNumber()
  @IsNotEmpty()
  PORT: number;

  @IsString()
  @IsNotEmpty()
  DATABASE_HOST: string;

  @IsNumber()
  @IsNotEmpty()
  DATABASE_PORT: number;

  @IsString()
  @IsNotEmpty()
  DATABASE_USERNAME: string;

  @IsString()
  @IsNotEmpty()
  DATABASE_PASSWORD: string;

  @IsString()
  @IsNotEmpty()
  DATABASE_NAME: string;
}
