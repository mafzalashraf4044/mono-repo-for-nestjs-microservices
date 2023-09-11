import { resolve } from 'path';
import * as dotenv from 'dotenv';
import { exec } from 'child_process';

import {
  CommandLineArgs,
  Config,
  ShellCommandResult,
} from './migration.interfaces';
import {
  NO_MIGRATION_COMMAND,
  NO_SERVICE_NAME,
  NO_SERVICE_ROOT_PATH,
} from './migration.errors';

export const getParsedDbConfig = (envFileName: string): Config => {
  const path = `${process.cwd()}/`;
  const config = dotenv.config({ path: resolve(path, envFileName) });

  if (config.error || !config.parsed) {
    throw config.error;
  }

  return {
    host: config.parsed['DATABASE_HOST'] || 'localhost',
    port: parseInt(config.parsed['DATABASE_PORT'], 10) || 5432,
    username: config.parsed['DATABASE_USERNAME'] || 'postgres',
    password: config.parsed['DATABASE_PASSWORD'] || 'localhost',
    database: config.parsed['DATABASE_NAME'] || 'user_gate',
  };
};

export const parseCommandLineArgs = (): CommandLineArgs => {
  const migrationCommand = process.argv[2];
  const serviceRootPath = process.argv[3];
  const serviceName = process.argv[4];

  if (!migrationCommand) {
    throw new Error(NO_MIGRATION_COMMAND);
  }

  if (!serviceRootPath) {
    throw new Error(NO_SERVICE_ROOT_PATH);
  }

  if (!serviceName) {
    throw new Error(NO_SERVICE_NAME);
  }

  return {
    migrationCommand,
    serviceRootPath,
    serviceName,
  };
};

export const executeShellCommand = (
  command: string,
): Promise<ShellCommandResult> => {
  return new Promise((resolve, reject) => {
    exec(command, (err, stdout, stderr) => {
      if (err) {
        resolve({
          stdout,
          stderr,
        });
      }

      resolve({
        stdout,
        stderr,
      });
    });
  });
};
