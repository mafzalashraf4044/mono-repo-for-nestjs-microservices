import { UserGender } from '@common/enums';

export interface AdminDetails {
  gender: UserGender;
  dob: Date;
}

export interface AdminNotificationPreferences {
  email: boolean;
  sms: boolean;
}

export interface AdminPreferences {
  notifications: AdminNotificationPreferences;
}
