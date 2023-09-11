/** @format */

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import {
  ApolloFederationDriver,
  ApolloFederationDriverConfig,
} from '@nestjs/apollo';
import { GraphQLModule } from '@nestjs/graphql';
import { addTransactionalDataSource } from 'typeorm-transactional';

import { graphQLErrorFormatter } from '@swiq/common/graphql';
import { upperDirectiveTransformer } from '@swiq/common/graphql';
import { ConfigModule } from '@config/config.module';
import { TypeOrmService } from '@database/database.service';
import UserModule from '@modules/user/user.module';
import MemberModule from '@modules/member/member.module';
import AdminModule from '@modules/admin/admin.module';
// import { KafkaModule } from '@kafka/kafka.module';
import { INVALID_OPTIONS_PASSED } from '@swiq/common/errors';

import { GrpcModule } from '@grpc-svc/grpc.module';

@Module({
  imports: [
    ConfigModule,
    UserModule,
    MemberModule,
    AdminModule,
    GraphQLModule.forRoot<ApolloFederationDriverConfig>({
      driver: ApolloFederationDriver,
      autoSchemaFile: { path: 'schema.gql', federation: 2 },
      context: ({ req }: any) => ({ req }),
      transformSchema: schema => upperDirectiveTransformer(schema, 'upper'),
      installSubscriptionHandlers: false,
      formatError: graphQLErrorFormatter,
      csrfPrevention: false,
    }),
    // KafkaModule,
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmService,
      async dataSourceFactory(options) {
        if (!options) {
          throw new Error(INVALID_OPTIONS_PASSED);
        }

        return addTransactionalDataSource(new DataSource(options));
      },
    }),
    GrpcModule,
  ],
  providers: [],
})
export class AppModule {}
