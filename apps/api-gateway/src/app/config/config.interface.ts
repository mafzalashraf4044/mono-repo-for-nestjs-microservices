/**
 * Configuration for the database connection.
 */

export interface AuthConfig {
  jwtSecret: string;
  expireIn: number;
}

export interface Subgraph {
  name: string;
  url: string;
}

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

  auth: AuthConfig;

  subgraphs: Subgraph[];
}
