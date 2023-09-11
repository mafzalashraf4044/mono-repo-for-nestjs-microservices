/* eslint-disable */
import { Metadata } from '@grpc/grpc-js';
import { GrpcMethod, GrpcStreamMethod } from '@nestjs/microservices';
import { Observable } from 'rxjs';

export const protobufPackage = 'healthjournal';

export interface HealthJournalGRPCServiceTestRequest {
  data: string;
}

export interface HealthJournalGRPCServiceTestResponse {
  isWorking: boolean;
}

export const HEALTHJOURNAL_PACKAGE_NAME = 'healthjournal';

export interface HealthJournalGRPCServiceClient {
  testGrpc(
    request: HealthJournalGRPCServiceTestRequest,
    metadata?: Metadata,
  ): Observable<HealthJournalGRPCServiceTestResponse>;
}

export interface HealthJournalGRPCServiceController {
  testGrpc(
    request: HealthJournalGRPCServiceTestRequest,
    metadata?: Metadata,
  ):
    | Promise<HealthJournalGRPCServiceTestResponse>
    | Observable<HealthJournalGRPCServiceTestResponse>
    | HealthJournalGRPCServiceTestResponse;
}

export function HealthJournalGRPCServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = ['testGrpc'];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(
        constructor.prototype,
        method,
      );
      GrpcMethod('HealthJournalGRPCService', method)(
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
      GrpcStreamMethod('HealthJournalGRPCService', method)(
        constructor.prototype[method],
        method,
        descriptor,
      );
    }
  };
}

export const HEALTH_JOURNAL_GR_PC_SERVICE_NAME = 'HealthJournalGRPCService';
