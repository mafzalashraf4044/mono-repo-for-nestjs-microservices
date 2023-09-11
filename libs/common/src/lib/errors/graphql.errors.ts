import { HttpStatus } from '@nestjs/common';
import { GraphQLError } from 'graphql';

export class NotFoundError extends GraphQLError {
  constructor(message = 'Not Found') {
    super(message, { extensions: { code: HttpStatus.NOT_FOUND } });
  }
}
export class UnauthorizedError extends GraphQLError {
  constructor(message = 'Unauthorized') {
    super(message, { extensions: { code: HttpStatus.UNAUTHORIZED } });
  }
}
export class BadRequestError extends GraphQLError {
  constructor(message = 'Bad Request') {
    super(message, { extensions: { code: HttpStatus.BAD_REQUEST } });
  }
}
