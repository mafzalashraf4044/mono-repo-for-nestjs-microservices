import {
  Field,
  ID,
  ObjectType,
  GraphQLISODateTime,
  Int,
} from '@nestjs/graphql';

import { registerGraphQLEnums } from '@swiq/common/utils';
import { UserGender } from '@common/enums';

// Register Enums
registerGraphQLEnums([
  {
    name: 'UserGender',
    enum: UserGender,
  },
]);

@ObjectType()
export class AdminDetails {
  @Field(() => UserGender)
  gender: UserGender;

  @Field(() => GraphQLISODateTime)
  dob: Date;
}

@ObjectType()
export class AdminPreferencesNotifications {
  @Field(() => Boolean)
  email: boolean;

  @Field(() => Boolean)
  sms: boolean;
}

@ObjectType()
export class AdminPreferences {
  @Field(() => AdminPreferencesNotifications)
  notifications: AdminPreferencesNotifications;
}

@ObjectType({ description: 'admin' })
class Admin {
  @Field(() => ID)
  id: number;

  @Field(() => Int)
  userId: number;

  @Field(() => AdminDetails)
  details: AdminDetails;

  @Field(() => AdminPreferences)
  preferences: AdminPreferences;

  @Field(() => GraphQLISODateTime)
  createdAt: Date;

  @Field(() => GraphQLISODateTime)
  updatedAt: Date;
}

export default Admin;
