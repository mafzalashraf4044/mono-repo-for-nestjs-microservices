import { registerEnumType } from '@nestjs/graphql';

import { GraphQLRegisterEnum } from '../interfaces';

export const registerGraphQLEnums = (
  graphQLRegisterEnums: GraphQLRegisterEnum<any>[],
) => {
  graphQLRegisterEnums.forEach(graphQLRegisterEnum => {
    // Register Enum with graphql
    registerEnumType(graphQLRegisterEnum.enum, {
      name: graphQLRegisterEnum.name,
    });
  });
};
