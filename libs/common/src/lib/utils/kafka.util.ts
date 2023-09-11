import { KafkaOptions, Transport } from '@nestjs/microservices';

import { KafkaClientConfig } from '../interfaces/config.interface';
import { MISSING_KAFKA_ENV_VARIABLES } from '../errors/config.errors';

export const parseKafkaClientConfigFromEnv = (): KafkaClientConfig => {
  if (!process.env['KAFKA_BROKER']) {
    throw new Error(MISSING_KAFKA_ENV_VARIABLES);
  }

  return {
    broker: process.env['KAFKA_BROKER'],
  };
};

export const getKafkaClientConfigOptions = (
  isProduction: boolean,
  config: KafkaClientConfig,
  consumerGroupId: string,
  clientId?: string,
): KafkaOptions => {
  const kafkaOptions: any = {
    transport: Transport.KAFKA,
    options: {
      client: {
        brokers: [config.broker],
        connectionTimeout: 10000,
        requestTimeout: 30000,
      },
      consumer: {
        groupId: consumerGroupId,
      },
    },
  };

  if (isProduction && config.sasl) {
    kafkaOptions.options.client.ssl = true;

    kafkaOptions.options.client.sasl = {
      mechanism: config.sasl.mechanism, // scram-sha-256 or scram-sha-512
      username: config.sasl.username,
      password: config.sasl.password,
    };
  }

  if (clientId) {
    kafkaOptions.options.client.clientId = clientId;
  }

  return kafkaOptions as KafkaOptions;
};
