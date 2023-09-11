import {
  PgSQLConnectionConfig,
  KafkaClientConfig,
  EncryptionConfig,
  AuthConfig,
} from '@swiq/common/interfaces';

export interface GrpcPortConfig {
  userGateSvc: number;
  healthJournalSvc: number;
}

/**
 * Configuration data for the app.
 */
export interface Config {
  /**
   * The name of the environment.
   * @example 'production'
   */
  isProduction: boolean;

  env: string;

  port: number;

  grpcPorts: GrpcPortConfig;

  /** Database connection details. */
  db: PgSQLConnectionConfig;

  kafka: KafkaClientConfig;

  encryptionConfig: EncryptionConfig;

  authConfig: AuthConfig;
}
