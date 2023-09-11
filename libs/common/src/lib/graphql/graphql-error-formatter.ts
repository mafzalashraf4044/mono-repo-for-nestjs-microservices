import { ApolloServerErrorCode } from '@apollo/server/errors';
import { GraphQLFormattedError } from 'graphql';

export const graphQLErrorFormatter = (
  formattedError: GraphQLFormattedError,
) => {
  // Docs: https://www.apollographql.com/docs/apollo-server/data/errors/

  if (
    formattedError.extensions?.['code'] ===
    ApolloServerErrorCode.GRAPHQL_VALIDATION_FAILED
  ) {
    return {
      ...formattedError,
      message: "Your query doesn't match the schema. Try double-checking it!",
    };
  }

  const graphQLFormattedError = {
    message: formattedError.message,
    code: formattedError.extensions?.['code'] || 'INTERNAL_SERVER_ERROR',
  };

  return graphQLFormattedError;
};
