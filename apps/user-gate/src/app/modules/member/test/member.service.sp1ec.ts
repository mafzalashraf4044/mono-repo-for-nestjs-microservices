import { Test, TestingModule } from '@nestjs/testing';
import { createMock } from '@golevelup/ts-jest';
import { initializeTransactionalContext } from 'typeorm-transactional';

import UserEntity from '@modules/user/user.entity';
import MemberEntity from '@modules/member/member.entity';
import MemberRepository from '@modules/member/member.repository';
import MemberService from '@modules/member/member.service';
import UserService from '@modules/user/user.service';
import { PasswordlessTokenService } from '@modules/passwordless-token/passwordless-token.service';
import {
  MEMBER_SIGNUP_REQUEST,
  MEMBER_LIST,
  CREATED_USER,
} from '@common/testing/fixtures';
import { NotFoundError } from '@swiq/common/errors';

describe('MemberService', () => {
  let service: MemberService;
  const mockedMemberRepository = createMock<MemberRepository>();
  const mockedUserService = createMock<UserService>();
  const mockedPasswordlessTokenService = createMock<PasswordlessTokenService>();

  beforeAll(() => {
    initializeTransactionalContext();
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MemberService,
        {
          provide: MemberRepository,
          useValue: mockedMemberRepository,
        },
        {
          provide: UserService,
          useValue: mockedUserService,
        },
        {
          provide: PasswordlessTokenService,
          useValue: mockedPasswordlessTokenService,
        },
      ],
    }).compile();

    service = module.get<MemberService>(MemberService);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findOneById', () => {
    it('should return the member with provided id', async () => {
      const member = MEMBER_LIST.find(m => m.id === 1);
      mockedMemberRepository.getEntityById.mockResolvedValue(
        member as MemberEntity,
      );

      const returnedMember = await service.findOneById(member.id);
      expect(returnedMember).toEqual(member);
    });

    it("should throw NotFoundError if the member with provided id doesn't exist", async () => {
      mockedMemberRepository.getEntityById.mockResolvedValue(null);

      const notFoundError = new NotFoundError();
      await expect(service.findOneById(100)).rejects.toEqual(notFoundError);
    });
  });

  describe('getAll', () => {
    it('should return an array of all members', async () => {
      mockedMemberRepository.getEntities.mockResolvedValue(
        MEMBER_LIST as MemberEntity[],
      );

      const returnedMembers = await service.getAll();
      expect(returnedMembers).toEqual(MEMBER_LIST);
    });
  });

  describe('signupMember', () => {
    it('should create a new user if not already exist', async () => {
      mockedUserService.create.mockResolvedValue(CREATED_USER as UserEntity);
      mockedUserService.findByEmail.mockResolvedValue(null);

      const member = MEMBER_LIST.find(m => m.id === 1);
      mockedMemberRepository.save.mockResolvedValue(member as MemberEntity);

      const signedUpMember = await service.signupMember(MEMBER_SIGNUP_REQUEST);
      expect(signedUpMember).toEqual(member);
    });

    it('should return the user if it already exist with the same email, status = NotVerified or membership = null', async () => {
      mockedUserService.findByEmail.mockResolvedValue(
        CREATED_USER as UserEntity,
      );
      const member = MEMBER_LIST.find(m => m.userId === CREATED_USER.id);
      mockedMemberRepository.findOneBy.mockResolvedValue(
        member as MemberEntity,
      );

      const signedUpMember = await service.signupMember(MEMBER_SIGNUP_REQUEST);
      expect(signedUpMember).toEqual(member);

      // make sure create user/member functions are not called
      expect(mockedUserService.create).toHaveBeenCalledTimes(0);
      expect(mockedMemberRepository.save).toHaveBeenCalledTimes(0);
      expect(mockedPasswordlessTokenService.create).toHaveBeenCalledTimes(0);
    });
  });
});
