import {
  Field,
  ID,
  ObjectType,
  GraphQLISODateTime,
  Int,
} from '@nestjs/graphql';

import {
  MemberDeviceType,
  MemberGoal,
  MembershipType,
  UserGender,
} from '@common/enums';
import { registerGraphQLEnums } from '@swiq/common/utils';
import User from '@modules/user/user.model';

// Register Enums
registerGraphQLEnums([
  {
    name: 'UserGender',
    enum: UserGender,
  },
  {
    name: 'MemberDeviceType',
    enum: MemberDeviceType,
  },
  {
    name: 'MemberGoal',
    enum: MemberGoal,
  },
  {
    name: 'MembershipType',
    enum: MembershipType,
  },
]);

@ObjectType()
export class MemberDetails {
  @Field(() => UserGender)
  gender: UserGender;

  @Field(() => Date)
  dob: Date;

  @Field(() => Number)
  weight: number;

  @Field(() => Number)
  height: number;

  @Field(() => String)
  fitnessLevel: string;

  @Field(() => String)
  dietPlan: string;
}

@ObjectType()
export class MemberAppToken {
  @Field(() => String)
  android: string;

  @Field(() => String)
  ios: string;
}

@ObjectType()
export class MemberNotificationsApp {
  @Field(() => Boolean)
  sensorScanReminder: boolean;

  @Field(() => Boolean)
  mealScoreReady: boolean;
}

@ObjectType()
export class MemberNotifications {
  @Field(() => MemberNotificationsApp)
  app: MemberNotificationsApp;

  @Field(() => Boolean)
  email: boolean;
}

@ObjectType()
export class MemberPreferencesUnits {
  @Field()
  height: string;

  @Field()
  weight: string;

  @Field()
  glucose: string;
}

@ObjectType()
export class MemberPreferences {
  @Field(() => MemberNotifications)
  notifications: MemberNotifications;

  @Field(() => MemberPreferencesUnits)
  units: MemberPreferencesUnits;

  @Field(() => String)
  targetZone: string;

  @Field(() => Boolean)
  shareUsageStats: boolean;
}

@ObjectType()
export class MemberMembership {
  @Field(() => String)
  subscriptionId: string;

  @Field(() => MembershipType)
  type: MembershipType;
}

@ObjectType({ description: 'member' })
export class MemberModel {
  @Field(() => ID)
  id: number;

  @Field(() => Int)
  userId: number;

  @Field(() => MemberDetails)
  details: MemberDetails;

  @Field(() => MemberGoal)
  goal: MemberGoal;

  @Field(() => [MemberDeviceType])
  devices: MemberDeviceType[];

  @Field(() => MemberAppToken)
  appToken: MemberAppToken;

  @Field(() => MemberPreferences)
  preferences: MemberPreferences;

  @Field(() => MemberMembership)
  membership: MemberMembership;

  @Field(() => GraphQLISODateTime)
  createdAt: Date;

  @Field(() => GraphQLISODateTime)
  updatedAt: Date;
}

@ObjectType()
export class MemberWithUser extends MemberModel {
  @Field(() => User)
  user: User;
}

@ObjectType()
export class MemberLoginResponse {
  @Field(() => MemberWithUser)
  member: MemberWithUser;

  @Field(() => String)
  jwtToken: string;

  @Field(() => String)
  refreshToken: string;
}
