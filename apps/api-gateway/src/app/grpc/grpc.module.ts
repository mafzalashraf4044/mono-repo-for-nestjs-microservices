import { Global, Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';

import { getUserServiceGrpcClientConfig } from '@swiq/common/utils';
import { getHealthServiceGrpcClientConfig } from '@swiq/common/utils';
import { USERGATE_PACKAGE_NAME } from '@proto/user-gate';
import { HEALTHJOURNAL_PACKAGE_NAME } from '@proto/health-journal';

@Global()
@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: USERGATE_PACKAGE_NAME,
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => {
          const userSvcGRPCPort = configService.get<number>(
            'grpcPorts.userGateSvc',
            7000,
          );

          return getUserServiceGrpcClientConfig(userSvcGRPCPort) as any;
        },
      },
      {
        name: HEALTHJOURNAL_PACKAGE_NAME,
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => {
          const healthSvcGRPCPort = configService.get<number>(
            'grpcPorts.healthJournalSvc',
            7001,
          );

          return getHealthServiceGrpcClientConfig(healthSvcGRPCPort) as any;
        },
      },
    ]),
  ],
  exports: [ClientsModule],
})
export class GrpcModule {}
