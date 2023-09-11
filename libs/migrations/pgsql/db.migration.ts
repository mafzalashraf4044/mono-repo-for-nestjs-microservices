/* eslint-disable no-useless-catch */
import * as fs from 'fs/promises';

import { Environment } from '@swiq/common/enums';
import { getEnvFile } from '@swiq/common/utils';

import dataSourceTemplate from './data-source-template';
import { MigrationCommands } from './migration.enums';
import {
  INVALID_MIGRATION_COMMAND,
  UNABLE_TO_PARSE_ENV_CONFIG,
} from './migration.errors';
import { Config, DataSourceConfig, DbConfigAws } from './migration.interfaces';
import {
  executeShellCommand,
  getParsedDbConfig,
  parseCommandLineArgs,
} from './migration.utils';

export const DEFAULT_MIGRATION_FILE_NAME = 'db.migration.temp.ts';

export const fetchDbConfigFromAWS = async (): Promise<DbConfigAws> => {
  // TODO: Later on we will fetch database related secrets from AWS Secret Manager
  return {
    password: 'localhost',
  };
};

export const fetchConfigFromSource = async (): Promise<Config> => {
  const env = process.env['NODE_ENV'] || Environment.Development;

  const envFileName = getEnvFile();

  const config = getParsedDbConfig(envFileName);

  if (!config) throw new Error(UNABLE_TO_PARSE_ENV_CONFIG);

  if (env === Environment.Production) {
    // Fetch configs from AWS Secrets and return as a config
    const dbConfigFromAws = await fetchDbConfigFromAWS();

    return {
      ...config,
      password: dbConfigFromAws.password,
    };
  } else {
    return config;
  }
};

export const prepareDataSourceConfig = (
  config: Config,
  migrations: string[],
): DataSourceConfig => {
  return {
    type: 'postgres',
    host: config.host,
    port: config.port,
    username: config.username,
    password: config.password,
    database: config.database,
    migrations,
  };
};

export const prepareDataSourceConfigFileContent = (
  dataSourceTemplate: string,
  dataSourceConfig: DataSourceConfig,
): string => {
  // Stringify dataSourceConfig object and replace it in generated file template
  const stringifiedConfig = `{
        type: '${dataSourceConfig.type}',
        host: '${dataSourceConfig.host}',
        port: ${dataSourceConfig.port},
        username: '${dataSourceConfig.username}',
        password: '${dataSourceConfig.password}',
        database: '${dataSourceConfig.database}',
        entities: ['./**/*.entity{.js,.ts}'],
        migrations: [${
          dataSourceConfig.migrations.map(item => `'${item}'`).join(',') || ''
        }]
    }`;

  dataSourceTemplate = dataSourceTemplate.replace('$CONFIG', stringifiedConfig);

  return dataSourceTemplate;
};

export const generateDataSourceConfigFile = async (
  tempFilePath: string,
  content: string,
) => {
  await fs.writeFile(tempFilePath, content);
};

export const generateMigrationsByCli = async (
  migrationConfigFilePath: string,
  migrationFilePath: string,
): Promise<string> => {
  const migrationGenerationCommand = `ts-node --project ./tsconfig.json -r tsconfig-paths/register ../../node_modules/typeorm/cli.js -d ${migrationConfigFilePath} migration:generate ${migrationFilePath}`;

  const output = await executeShellCommand(migrationGenerationCommand);

  if (output.stderr) console.log(output.stderr);
  if (output.stdout) console.log(output.stdout);

  return output.stdout;
};

export const runMigrationsByCli = async (
  migrationFilePath: string,
): Promise<string> => {
  const migrationRunCommand = `ts-node --project ./tsconfig.json -r tsconfig-paths/register ../../node_modules/typeorm/cli.js -d ${migrationFilePath} migration:run`;

  const output = await executeShellCommand(migrationRunCommand);

  if (output.stderr) console.log(output.stderr);
  if (output.stdout) console.log(output.stdout);

  return output.stdout;
};

export const executeMigrationsCommand = async (
  command: string,
  migrationConfigFilePath: string,
  migrationFilePath: string,
) => {
  switch (command) {
    case MigrationCommands.Generate:
      await generateMigrationsByCli(migrationConfigFilePath, migrationFilePath);

      break;

    case MigrationCommands.Run:
      await runMigrationsByCli(migrationConfigFilePath);

      break;

    default:
      throw new Error(INVALID_MIGRATION_COMMAND);
  }
};

export const cleanTempMigrationFile = async (migrationFilePath: string) => {
  await fs.unlink(migrationFilePath);
};

const runAsync = async () => {
  // Parse command line args
  const cliArgs = parseCommandLineArgs();

  /**
   * Path where the temperory migration config file will be created and then passed to
   * typeorm cli for execution
   */
  const migrationConfigFilePath = `${cliArgs.serviceRootPath}/src/app/database/${DEFAULT_MIGRATION_FILE_NAME}`;
  const migrationFilePath = `${cliArgs.serviceRootPath}/src/migrations/${cliArgs.serviceName}`;

  try {
    // Fetch config from source
    const config = await fetchConfigFromSource();

    // Prepare DataSourceConfig
    const dataSourceConfig = prepareDataSourceConfig(config, [
      './src/migrations/*.ts',
    ]);

    // Prepare DataSourceConfig file content
    const content = prepareDataSourceConfigFileContent(
      dataSourceTemplate,
      dataSourceConfig,
    );

    // Generate Temperory DataSourceConfig file to be used by CLI
    await generateDataSourceConfigFile(migrationConfigFilePath, content);

    // Execute migration command
    await executeMigrationsCommand(
      cliArgs.migrationCommand,
      migrationConfigFilePath,
      migrationFilePath,
    );
  } catch (e) {
    throw e;
  } finally {
    // Remove Temperory Migration file
    await cleanTempMigrationFile(migrationConfigFilePath);
  }
};

runAsync();
