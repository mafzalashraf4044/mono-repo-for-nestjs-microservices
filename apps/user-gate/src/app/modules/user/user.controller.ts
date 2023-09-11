import { Metadata } from '@grpc/grpc-js';
import { Controller } from '@nestjs/common';

import {
  UserGateGRPCServiceController,
  UserGateGRPCServiceControllerMethods,
  UserGateGRPCServiceTestRequest,
  UserGateGRPCServiceTestResponse,
} from '@proto/user-gate';

@Controller('user')
@UserGateGRPCServiceControllerMethods()
class UserController implements UserGateGRPCServiceController {
  // TODO: Only for testing the grpc communication
  async testGrpc(
    request: UserGateGRPCServiceTestRequest,
    metadata?: Metadata,
  ): Promise<UserGateGRPCServiceTestResponse> {
    console.log(`Got this data in GRPC Request: ${JSON.stringify(request)}`);
    console.log(`GRPC Metadata: ${metadata.toJSON()}`);

    return {
      isWorking: true,
    };
  }
}

export default UserController;
