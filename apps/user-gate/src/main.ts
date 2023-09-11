import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { MicroserviceOptions } from '@nestjs/microservices';
import {
  NestExpressApplication,
  ExpressAdapter,
} from '@nestjs/platform-express';
import { graphqlUploadExpress } from 'graphql-upload'

import { WinstonModule } from 'nest-winston';
import { join } from 'path';
import { initializeTransactionalContext } from 'typeorm-transactional';

import { EncryptColumn } from '@swiq/common/transformers';
import {
  createLogger,
  getGrpcServerConfig,
} from '@swiq/common/utils';
import { KafkaClientConfig } from '@swiq/common/interfaces';
import * as UserService from '@proto/user-gate';

import { AppModule } from './app/app.module';

async function bootstrap() {
  // Initialize cls-hooked
  initializeTransactionalContext();

  const app = await NestFactory.create<NestExpressApplication>(
    AppModule,
    new ExpressAdapter(),
    {
      logger: WinstonModule.createLogger({
        instance: createLogger(),
      }),
    },
  );

  const configService = app.get<ConfigService>(ConfigService);

  const isProduction = configService.get<boolean>('isProduction', false);
  const kafkaClientConfig = configService.get<KafkaClientConfig>('kafka');
  const port = configService.get<number>('port', 3000);
  const grpcPort = configService.get<number>('grpcPort', 7000);

  // Set static configService in EncryptColumn class which will be used to fetch encryption keys
  EncryptColumn.configService = configService;

  app.use('/graphql', graphqlUploadExpress({ maxFileSize: 1000000, maxFiles: 10 }))
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: false, // this should be true, but for some
      transform: true,
    }),
  );

  await app.listen(port, '0.0.0.0');

  // Connect Kafka Microservice
  // app.connectMicroservice<MicroserviceOptions>(
  //   getKafkaClientConfigOptions(
  //     isProduction,
  //     kafkaClientConfig,
  //     MICRO_SERVICES.userGate.consumerGroupId,
  //   ),
  // );

  // Connect gRPC Microservice
  app.connectMicroservice<MicroserviceOptions>(
    getGrpcServerConfig(
      grpcPort,
      UserService.USERGATE_PACKAGE_NAME,
      join(__dirname, 'assets/proto/user-gate/user-gate.proto'),
    ),
  );

  await app.startAllMicroservices();

  Logger.log(`🚀 Application is running on: http://localhost:${port}}`);
}
bootstrap();
