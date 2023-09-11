import { parseAuthConfigFromEnv } from '@swiq/common/utils';

import { Config, Subgraph } from '@config/config.interface';

const parseSubgraphConfigsFromEnv = (): Subgraph[] => {
  const subgraphs: Subgraph[] = [];

  //Parse USER_GATE configs
  const userGateSubgraph: Subgraph = {
    name: process.env.SUBGRAPH_USER_GATE_NAME || 'User',
    url: process.env.SUBGRAPH_USER_GATE_URL || 'http://user-gate:3000/graphql',
  };

  subgraphs.push(userGateSubgraph);

  return subgraphs;
};

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
    auth: parseAuthConfigFromEnv(),
    subgraphs: parseSubgraphConfigsFromEnv(),
  };
};
