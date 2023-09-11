// src/config/config.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';

import { getEnvFile } from '@config/config.env-util';
import configuration from '@config/config.service';
import validate from '@config/config.validator';

@Module({
  imports: [
    NestConfigModule.forRoot({
      validate,
      load: [async () => configuration()],
      isGlobal: true,
      envFilePath: getEnvFile(),
    }),
  ],
  exports: [NestConfigModule],
})
export class ConfigModule {}
