import { Transport } from '@nestjs/microservices';
import { join } from 'path';

import { GrpcClientConfig, GrpcServerConfig } from '@swiq/common/interfaces';

import * as UserService from '../../../../grpc/grpc-proto-definitions/user-gate/user-gate';
import * as HealthService from '../../../../grpc/grpc-proto-definitions/health-journal/health-journal';

export const getUserServiceGrpcClientConfig = (
  port: number,
): GrpcClientConfig => {
  return {
    name: UserService.USERGATE_PACKAGE_NAME,
    transport: Transport.GRPC,
    options: {
      url: `user-gate:${port}`,
      package: UserService.USERGATE_PACKAGE_NAME,
      protoPath: join(__dirname, 'assets/proto/user-gate/user-gate.proto'),
    },
  };
};

export const getHealthServiceGrpcClientConfig = (
  port: number,
): GrpcClientConfig => {
  return {
    name: HealthService.HEALTHJOURNAL_PACKAGE_NAME,
    transport: Transport.GRPC,
    options: {
      url: `health-journal:${port}`,
      package: HealthService.HEALTHJOURNAL_PACKAGE_NAME,
      protoPath: join(
        __dirname,
        'assets/proto/health-journal/health-journal.proto',
      ),
    },
  };
};

export const getGrpcServerConfig = (
  port: number,
  packageName: string,
  protoPath: string,
): GrpcServerConfig => {
  return {
    transport: Transport.GRPC,
    options: {
      url: `0.0.0.0:${port}`,
      package: packageName,
      protoPath,
      loader: {
        keepCase: true,
      },
    },
  };
};
