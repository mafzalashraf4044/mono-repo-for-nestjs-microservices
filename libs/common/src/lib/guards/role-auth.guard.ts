import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Reflector } from '@nestjs/core';

import { UNAUTHORIZED_OPERATION, UnauthorizedError } from '@swiq/common/errors';

@Injectable()
export class RoleAuthGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const gqlContext = GqlExecutionContext.create(context);

    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    const request = gqlContext.getContext().req;

    const userId = request.headers['x-user-id'];
    const role = request.headers['x-role'];

    if (!userId || !role || !roles.includes(role))
      throw new UnauthorizedError(UNAUTHORIZED_OPERATION);

    return true;
  }
}
