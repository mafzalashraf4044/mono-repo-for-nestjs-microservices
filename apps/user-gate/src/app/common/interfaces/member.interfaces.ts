import { MembershipType, UserGender } from '@common/enums';

export interface MemberDetails {
  gender: UserGender;
  dob: Date;
  weight: number;
  height: number;
  fitnessLevel: string;
  dietPlan: string;
}

export interface MemberAppToken {
  android: string;
  ios: string;
}

export interface MemberNotificationsApp {
  sensorScanReminder: boolean;
  mealScoreReady: boolean;
}

export interface MemberNotificationPreferences {
  app: MemberNotificationsApp;
  email: boolean;
}

export interface MemberUnitPreferences {
  height: string;
  weight: string;
  glucose: string;
}

export interface MemberPreferences {
  notifications: MemberNotificationPreferences;
  units: MemberUnitPreferences;
  targetZone: string;
  shareUsageStats: boolean;
}

export interface MemberMembership {
  subscriptionId: string;
  type: MembershipType;
}
