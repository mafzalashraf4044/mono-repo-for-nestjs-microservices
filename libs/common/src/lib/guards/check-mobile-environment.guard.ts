import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { GqlExecutionContext } from '@nestjs/graphql';

import { BadRequestError, INVALID_ENVIRONMENT_HEADER } from '../errors';
import {
  isMobileEnvironmentHeaderPresent,
  isMobileEnvironmentUserAgentPresent,
} from '../utils';

@Injectable()
export class CheckMobileEnvironmentGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const gqlContext = GqlExecutionContext.create(context);
    const request = gqlContext.getContext().req;

    const hasMobileEnvironmentHeader =
      isMobileEnvironmentHeaderPresent(request);
    const hasMobileUserAgent = isMobileEnvironmentUserAgentPresent(request);

    console.log('hasMobileEnvironmentHeader', hasMobileEnvironmentHeader);
    

    if (hasMobileEnvironmentHeader && hasMobileUserAgent) {
      return true;
    }

    throw new BadRequestError(INVALID_ENVIRONMENT_HEADER);
  }
}
