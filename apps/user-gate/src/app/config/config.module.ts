// src/config/config.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';

import { getEnvFile, validateEnvVariables } from '@swiq/common/utils';
import configuration from '@config/config.service';
import EnvironmentVariables from '@config/config.validator';

@Module({
  imports: [
    NestConfigModule.forRoot({
      validate: (config: Record<string, unknown>) => {
        return validateEnvVariables(EnvironmentVariables, config);
      },
      load: [async () => configuration()],
      isGlobal: true,
      envFilePath: getEnvFile(),
    }),
  ],
  exports: [NestConfigModule],
})
export class ConfigModule {}
