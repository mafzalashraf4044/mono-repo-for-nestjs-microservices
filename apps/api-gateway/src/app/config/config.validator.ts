import { plainToInstance } from 'class-transformer';
import { IsEnum, IsNumber, IsNotEmpty, validateSync, IsString, IsOptional } from 'class-validator';

enum Environment {
  Development = 'development',
  Production = 'production',
  Staging = 'staging',
}

class EnvironmentVariables {
  @IsEnum(Environment)
  @IsNotEmpty()
  NODE_ENV: Environment;

  @IsNumber()
  @IsNotEmpty()
  PORT: number;

  @IsString()
  @IsOptional()
  JWT_SECRET: string;

  @IsNumber()
  @IsOptional()
  JWT_EXPIRE_IN: number;

  @IsString()
  @IsNotEmpty()
  SUBGRAPH_USER_GATE_NAME: string;
  
  @IsString()
  @IsNotEmpty()
  SUBGRAPH_USER_GATE_URL: string;

}

function validate(config: Record<string, unknown>) {
  const validatedConfig = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }
  return validatedConfig;
}

export default validate;
