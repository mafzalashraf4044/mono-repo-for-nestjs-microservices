import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { GqlExecutionContext } from '@nestjs/graphql';

import { BadRequestError, INVALID_ENVIRONMENT_HEADER } from '../errors';
import { isWebsiteEnvironmentHeaderPresent } from '../utils';

@Injectable()
export class CheckWebsiteEnvironmentGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const gqlContext = GqlExecutionContext.create(context);

    const request = gqlContext.getContext().req;

    const isWebsiteEnvironment = isWebsiteEnvironmentHeaderPresent(request);

    if (isWebsiteEnvironment) {
      return true;
    }

    throw new BadRequestError(INVALID_ENVIRONMENT_HEADER);
  }
}
