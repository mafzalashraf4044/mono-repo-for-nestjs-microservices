import { join } from 'path';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

import { PgSQLConnectionConfig } from '../interfaces/config.interface';
import { Environment } from '../enums/config.enum';
import { MISSING_PG_SQL_ENV_VARIABLES } from '../errors/config.errors';

export const parsePgSQLConnectionConfigFromEnv = (): PgSQLConnectionConfig => {
  if (
    !process.env['DATABASE_HOST'] ||
    !process.env['DATABASE_PORT'] ||
    !process.env['DATABASE_USERNAME'] ||
    !process.env['DATABASE_PASSWORD'] ||
    !process.env['DATABASE_NAME']
  ) {
    throw new Error(MISSING_PG_SQL_ENV_VARIABLES);
  }

  return {
    host: process.env['DATABASE_HOST'],
    port: parseInt(process.env['DATABASE_PORT'], 10),
    username: process.env['DATABASE_USERNAME'],
    password: process.env['DATABASE_PASSWORD'],
    database: process.env['DATABASE_NAME'],
  };
};

export const getTypeOrmOptions = (
  env: Environment,
  config: PgSQLConnectionConfig,
): TypeOrmModuleOptions => {
  const options = {
    ...config,
    type: 'postgres' as any,
    entities: [join(__dirname + '/**/*.entity{.js,.ts}')],
    autoLoadEntities: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    keepConnectionAlive: true,
    synchronize: env === 'development',
    logging: false,
  };

  return options;
};
