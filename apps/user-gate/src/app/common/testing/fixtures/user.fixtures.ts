import { UserRole } from '@common/enums';

export const CREATED_USER = {
  id: 1,
  firstName: 'Afzal',
  lastName: 'Ashraf',
  email: 'afzal@gmail.com',
  username: 'aa4044',
  password: '123456',
  country: 'Pakistan',
  status: 'NotVerified',
  createdBy: 'User',
};

export const JWT_SECRET = '123456';

export const ACCESS_TOKEN_EXPIRY_IN_HOURS = 1;

export const JWT_VALID_MEMBER_TOKEN =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsIm1lbWJlcklkIjoxLCJyb2xlIjoiTWVtYmVyIn0.PQnuGZXeY4s4-6VGoPOH2AqvOpWijHqL_ocEbtx1kps';

export const JWT_VALID_ADMIN_TOKEN =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImFkbWluSWQiOjEsInJvbGUiOiJBZG1pbiJ9.kMeJCXGesIwTU6iPh_twhsd7Ovct2ywuVHV5zesJFmo';

export const JWT_INVALID_TOKEN =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsIm1lbWJlcklkIjoxLCJyb2xlIjoiTWVtYmVyIn0.PQnuGZXeY4s4-6VGoPOH2AqvOpWijHqL_ocEbtx1kpsa';

export const JWT_EXPIRED_TOKEN =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsIm1lbWJlcklkIjoxLCJyb2xlIjoiTWVtYmVyIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjE1MTYyMzkwMjJ9.Yq1QJDGggqjZMDOKyGB8s2lAkaaIsbGkW1odUCGlL5E';

export const JWT_MEMBER_PAYLOAD = {
  userId: 1,
  memberId: 1,
  role: 'Member' as UserRole,
};

export const JWT_ADMIN_PAYLOAD = {
  userId: 1,
  adminId: 1,
  role: 'Admin' as UserRole,
};
