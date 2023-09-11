import { Module } from '@nestjs/common';
import { IntrospectAndCompose } from '@apollo/gateway';
import { ApolloGatewayDriver, ApolloGatewayDriverConfig } from '@nestjs/apollo';
import { GraphQLModule } from '@nestjs/graphql';
import { ConfigService } from '@nestjs/config';

import { FileUploadDataSource } from '@common/lib';
import { ConfigModule } from '@config/config.module';
import { Subgraph } from '@config/config.interface';

import { willSendRequest, validateTokenFromHeader } from './federation.utils';

const handleAuth = ({ req }, jwtSecret: string) => {
  const payload = validateTokenFromHeader(req, jwtSecret) as any;

  return {
    ...payload,
    headers: req.headers,
  };
};

@Module({
  imports: [
    ConfigModule,
    GraphQLModule.forRootAsync<ApolloGatewayDriverConfig>({
      imports: [ConfigModule],
      driver: ApolloGatewayDriver,
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const subgraphs = configService.get<Subgraph[]>('subgraphs');

        const jwtToken = configService.get<string>('auth.jwtSecret');

        return {
          server: {
            context: data => handleAuth(data, jwtToken),
          },
          driver: ApolloGatewayDriver,
          gateway: {
            buildService: ({ url }) =>
              new FileUploadDataSource({
                url,
                useChunkedTransfer: false,
                willSendRequest,
              }),
            supergraphSdl: new IntrospectAndCompose({
              subgraphs,
            }),
          },
        };
      },
    }),
  ],
  exports: [GraphQLModule],
})
export class FederationModule {}
