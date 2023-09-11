import {
  parsePgSQLConnectionConfigFromEnv,
  parseKafkaClientConfigFromEnv,
  parseEncryptionConfigFromEnv,
  parseAuthConfigFromEnv,
} from '@swiq/common/utils';
import { Config } from '@config/config.interface';

export default async (): Promise<Config> => {
  // some async stuff to load secrets from AWS Secret Manager

  return {
    env: process.env.NODE_ENV,
    isProduction: process.env.NODE_ENV === 'production',
    port: parseInt(process.env.PORT, 10),
    grpcPorts: {
      userGateSvc: parseInt(process.env.GRPC_USER_SVC_PORT, 10),
      healthJournalSvc: parseInt(process.env.GRPC_HEALTH_SVC_PORT, 10),
    },
    db: parsePgSQLConnectionConfigFromEnv(),
    kafka: parseKafkaClientConfigFromEnv(),
    encryptionConfig: parseEncryptionConfigFromEnv(),
    authConfig: parseAuthConfigFromEnv(),
  };
};
