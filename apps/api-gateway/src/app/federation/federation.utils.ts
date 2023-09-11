import { verify } from 'jsonwebtoken';
import { type GraphQLDataSourceProcessOptions } from '@apollo/gateway';

import { UnauthorizedError } from '@swiq/common/errors';
import { INVALID_JWT_TOKEN, MISSING_JWT_TOKEN } from '@common/errors';

export const extractJwtTokenFromHeader = (
  authHeaderValue: string,
): string | undefined => {
  const [type, token] = authHeaderValue.split(' ') ?? [];
  return type === 'Bearer' ? token : undefined;
};

export const validateJwt = (token: string, secret: string) => {
  try {
    return verify(token, secret);
  } catch (e) {
    return undefined;
  }
};

export const willSendRequest = (args: GraphQLDataSourceProcessOptions) => {
  const { request, context } = args;

  // Set original request headers
  request.http.headers.set(
    'x-environment-identifier',
    context.headers?.['x-environment-identifier'],
  );
  request.http.headers.set(
    'x-auth-passwordless',
    context.headers?.['x-auth-passwordless'],
  );
  request.http.headers.set('user-agent', context.headers?.['user-agent']);

  // Set user related headers
  request.http.headers.set('x-user-id', context?.userId);
  request.http.headers.set('x-member-id', context?.memberId);
  request.http.headers.set('x-role', context?.role);

  // for now pass authorization also
  request.http.headers.set('authorization', context?.authorization);
};

export const validateTokenFromHeader = (req: any, jwtSecret: string) => {
  // When authorization header is present then we validate the JWT
  if (req.headers['authorization'] !== undefined) {
    const token = extractJwtTokenFromHeader(req.headers['authorization']);
    if (!token) throw new UnauthorizedError(MISSING_JWT_TOKEN);

    const payload = validateJwt(token, jwtSecret);

    if (!payload) throw new UnauthorizedError(INVALID_JWT_TOKEN);

    return payload;
  }
};
