export interface CommandLineArgs {
  migrationCommand: string;
  serviceRootPath: string;
  serviceName: string;
}

export interface ShellCommandResult {
  stdout: string;
  stderr: string;
}

export interface DbConfigAws {
  password: string;
}

export interface Config {
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
}

export interface DataSourceConfig extends Config {
  type: string;
  migrations: string[];
}
