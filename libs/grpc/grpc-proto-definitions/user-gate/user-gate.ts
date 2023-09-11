/* eslint-disable */
import { Metadata } from '@grpc/grpc-js';
import { GrpcMethod, GrpcStreamMethod } from '@nestjs/microservices';
import { Observable } from 'rxjs';

export const protobufPackage = 'usergate';

export interface UserGateGRPCServiceTestRequest {
  data: string;
}

export interface UserGateGRPCServiceTestResponse {
  isWorking: boolean;
}

export const USERGATE_PACKAGE_NAME = 'usergate';

export interface UserGateGRPCServiceClient {
  testGrpc(
    request: UserGateGRPCServiceTestRequest,
    metadata?: Metadata,
  ): Observable<UserGateGRPCServiceTestResponse>;
}

export interface UserGateGRPCServiceController {
  testGrpc(
    request: UserGateGRPCServiceTestRequest,
    metadata?: Metadata,
  ):
    | Promise<UserGateGRPCServiceTestResponse>
    | Observable<UserGateGRPCServiceTestResponse>
    | UserGateGRPCServiceTestResponse;
}

export function UserGateGRPCServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = ['testGrpc'];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(
        constructor.prototype,
        method,
      );
      GrpcMethod('UserGateGRPCService', method)(
        constructor.prototype[method],
        method,
        descriptor,
      );
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(
        constructor.prototype,
        method,
      );
      GrpcStreamMethod('UserGateGRPCService', method)(
        constructor.prototype[method],
        method,
        descriptor,
      );
    }
  };
}

export const USER_GATE_GR_PC_SERVICE_NAME = 'UserGateGRPCService';
