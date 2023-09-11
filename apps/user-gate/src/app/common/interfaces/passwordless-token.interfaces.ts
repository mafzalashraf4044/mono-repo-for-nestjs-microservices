export interface CreatePasswordlessTokenPayload {
  userId: number;
  totalLimit: number;
  usedLimit: number;
  token: string;
  expiration: Date;
}
