import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientsModule } from '@nestjs/microservices';

import { MICRO_SERVICES } from '@swiq/common/constants';
import { KafkaClientConfig } from '@swiq/common/interfaces';
import { getKafkaClientConfigOptions } from '@swiq/common/utils';
import { ConfigModule } from '@config/config.module';

@Global()
@Module({
  imports: [
    ConfigModule,
    ClientsModule.registerAsync([
      {
        name: MICRO_SERVICES.healthJournal.clientId,
        imports: [ConfigModule],
        useFactory: async (configService: ConfigService) => {
          const isProduction = configService.get<boolean>(
            'isProduction',
            false,
          );
          const kafkaClientConfig =
            configService.get<KafkaClientConfig>('kafka');

          return getKafkaClientConfigOptions(
            isProduction,
            kafkaClientConfig,
            MICRO_SERVICES.healthJournal.clientId,
            MICRO_SERVICES.healthJournal.consumerGroupId,
          );
        },
        inject: [ConfigService],
      },
    ]),
  ],
  exports: [ClientsModule],
})
export class KafkaModule {}
