import { Transport } from '@nestjs/microservices';

export interface GrpcClientConfig {
  name: string;
  transport: Transport;
  options: {
    url: string;
    package: string;
    protoPath: string;
  };
}

export interface GrpcServerConfig {
  transport: Transport.GRPC;
  options: {
    url: string;
    package: string;
    protoPath: string;
    loader: {
      keepCase: boolean;
    };
  };
}
