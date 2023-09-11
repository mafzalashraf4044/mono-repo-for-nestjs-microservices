import { Global, Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';

import { getHealthServiceGrpcClientConfig } from '@swiq/common/utils';
import { HEALTHJOURNAL_PACKAGE_NAME } from '@proto/health-journal';

@Global()
@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: HEALTHJOURNAL_PACKAGE_NAME,
        inject: [ConfigService],
        useFactory(configService: ConfigService) {
          const healthSvcGrpcPort = configService.get<number>(
            'grpcPorts.healthJournalSvc',
            7001,
          );
          return getHealthServiceGrpcClientConfig(healthSvcGrpcPort) as any;
        },
      },
    ]),
  ],
  exports: [ClientsModule],
})
export class GrpcModule {}
