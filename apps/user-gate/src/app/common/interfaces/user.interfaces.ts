export interface BaseVerificationCode {
  code: string;
  expiration: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface VerificationCodeResetPassword extends BaseVerificationCode {}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface VerificationCodeSignup extends BaseVerificationCode {}

export interface UserVerificationCode {
  resetPassword: VerificationCodeResetPassword;
  signup: VerificationCodeSignup;
}

export interface LoginUserResponse {
  jwtToken: string;
  refreshToken: string;
}
