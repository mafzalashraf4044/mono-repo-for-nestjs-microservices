import { Environment } from '../enums';

export interface EnvironmentVariablesInterface {
  NODE_ENV: Environment;
  PORT: number;
  DATABASE_HOST: string;
  DATABASE_PORT: number;
  DATABASE_USERNAME: string;
  DATABASE_PASSWORD: string;
  DATABASE_NAME: string;
}

export interface PgSQLConnectionConfig {
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
}

interface KafkaConnectionSASLConfig {
  mechanism: string;
  username: string;
  password: string;
}

export interface KafkaClientConfig {
  broker: string;
  sasl?: KafkaConnectionSASLConfig;
}

export interface EncryptionConfig {
  key: string;
  iv: string;
}

export interface AuthConfig {
  jwtSecret: string;
  expireIn: number;
}
