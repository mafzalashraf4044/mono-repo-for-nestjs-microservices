import { Test, TestingModule } from '@nestjs/testing';
import { createMock } from '@golevelup/ts-jest';
import { initializeTransactionalContext } from 'typeorm-transactional';
import { JwtService, JwtModule } from '@nestjs/jwt';
import moment from 'moment';

import UserRepository from '@modules/user/user.repository';
import UserService from '@modules/user/user.service';
import { PasswordlessTokenService } from '@modules/passwordless-token/passwordless-token.service';
import MemberService from '@modules/member/member.service';
import {
  JWT_ADMIN_PAYLOAD,
  JWT_INVALID_TOKEN,
  JWT_MEMBER_PAYLOAD,
  JWT_VALID_ADMIN_TOKEN,
  JWT_VALID_MEMBER_TOKEN,
  JWT_SECRET,
  JWT_EXPIRED_TOKEN,
  ACCESS_TOKEN_EXPIRY_IN_HOURS,
} from '@common/testing/fixtures';
import { UnauthorizedError } from '@swiq/common/errors';
import { INVALID_REFRESH_TOKEN } from '@common/errors';

describe('UserService', () => {
  let service: UserService;
  let jwtService: JwtService;
  const mockedUserRepository = createMock<UserRepository>();
  const mockedMemberService = createMock<MemberService>();
  const mockedPasswordlessTokenService = createMock<PasswordlessTokenService>();

  beforeAll(() => {
    initializeTransactionalContext();
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: UserRepository,
          useValue: mockedUserRepository,
        },
        {
          provide: PasswordlessTokenService,
          useValue: mockedPasswordlessTokenService,
        },
        {
          provide: MemberService,
          useValue: mockedMemberService,
        },
      ],
      imports: [
        JwtModule.register({
          secret: JWT_SECRET,
        }),
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    jwtService = module.get<JwtService>(JwtService);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateToken', () => {
    it('should return correct payloads if provided token is valid', async () => {
      const payloadResult = await service.validateToken(JWT_VALID_MEMBER_TOKEN);

      expect(payloadResult).toBeDefined();
      expect(payloadResult).toEqual(JWT_MEMBER_PAYLOAD);
      expect(payloadResult.memberId).toEqual(JWT_MEMBER_PAYLOAD.memberId);
      expect(payloadResult.userId).toEqual(JWT_MEMBER_PAYLOAD.userId);
      expect(payloadResult.role).toEqual(JWT_MEMBER_PAYLOAD.role);
    });

    it('should return null if provided token is invalid', async () => {
      const payloadInvalidTokenResult = await service.validateToken(
        JWT_INVALID_TOKEN,
      );

      expect(payloadInvalidTokenResult).toBeNull();
    });

    it('should return null if provided token is expired', async () => {
      const payloadExpiredTokenResult = await service.validateToken(
        JWT_EXPIRED_TOKEN,
      );

      expect(payloadExpiredTokenResult).toBeNull();
    });
  });

  describe('generateAccessTokenForUser', () => {
    it('should generate a valid JWT for the member based on provided payloads', async () => {
      const accessToken = await service.generateAccessTokenForUser(
        JWT_MEMBER_PAYLOAD.userId,
        JWT_MEMBER_PAYLOAD.memberId,
        JWT_MEMBER_PAYLOAD.role,
      );
      const payload = await jwtService.verifyAsync(accessToken);
      const tokenIssuedAt = moment.unix(payload.iat);
      const tokenExpiry = moment.unix(payload.exp);
      const timeDifference = tokenExpiry.diff(tokenIssuedAt, 'hours');

      expect(accessToken).toBeDefined();
      expect(payload).toBeDefined();
      expect(payload.userId).toEqual(JWT_MEMBER_PAYLOAD.userId);
      expect(payload.memberId).toEqual(JWT_MEMBER_PAYLOAD.memberId);
      expect(payload.role).toEqual(JWT_MEMBER_PAYLOAD.role);
      expect(timeDifference).toEqual(ACCESS_TOKEN_EXPIRY_IN_HOURS);
    });

    it('should generate a valid JWT for the admin based on provided payloads', async () => {
      const accessToken = await service.generateAccessTokenForUser(
        JWT_ADMIN_PAYLOAD.userId,
        JWT_ADMIN_PAYLOAD.adminId,
        JWT_ADMIN_PAYLOAD.role,
      );
      const payload = await jwtService.verifyAsync(accessToken);
      const tokenIssuedAt = moment.unix(payload.iat);
      const tokenExpiry = moment.unix(payload.exp);
      const timeDifference = tokenExpiry.diff(tokenIssuedAt, 'hours');

      expect(accessToken).toBeDefined();
      expect(payload).toBeDefined();
      expect(payload.userId).toEqual(JWT_ADMIN_PAYLOAD.userId);
      expect(payload.adminId).toEqual(JWT_ADMIN_PAYLOAD.adminId);
      expect(payload.role).toEqual(JWT_ADMIN_PAYLOAD.role);
      expect(timeDifference).toEqual(ACCESS_TOKEN_EXPIRY_IN_HOURS);
    });
  });

  describe('refreshUserAccessToken', () => {
    it('should throw UnauthorizedError if provided token is invalid.', async () => {
      const unAuthorizedError = new UnauthorizedError(INVALID_REFRESH_TOKEN);

      expect(
        service.refreshAccessTokenForUser(JWT_INVALID_TOKEN),
      ).rejects.toEqual(unAuthorizedError);

      expect(
        service.refreshAccessTokenForUser(JWT_EXPIRED_TOKEN),
      ).rejects.toEqual(unAuthorizedError);
    });

    it('should refresh the access token for member if refresh token is valid', async () => {
      const accessToken = await service.refreshAccessTokenForUser(
        JWT_VALID_MEMBER_TOKEN,
      );
      const payload = await service.validateToken(accessToken);

      expect(accessToken).toBeDefined();
      expect(payload).toBeDefined();
      expect(payload.userId).toEqual(JWT_MEMBER_PAYLOAD.userId);
      expect(payload.memberId).toEqual(JWT_MEMBER_PAYLOAD.memberId);
      expect(payload.role).toEqual(JWT_MEMBER_PAYLOAD.role);
    });

    it('should refresh the access token for admin if refresh token is valid', async () => {
      const accessToken = await service.refreshAccessTokenForUser(
        JWT_VALID_ADMIN_TOKEN,
      );
      const payload = await service.validateToken(accessToken);

      expect(accessToken).toBeDefined();
      expect(payload).toBeDefined();
      expect(payload.userId).toEqual(JWT_ADMIN_PAYLOAD.userId);
      expect(payload.adminId).toEqual(JWT_ADMIN_PAYLOAD.adminId);
      expect(payload.role).toEqual(JWT_ADMIN_PAYLOAD.role);
    });
  });
});
