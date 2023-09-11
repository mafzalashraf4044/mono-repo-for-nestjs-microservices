import { DataSource } from 'typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { createMock } from '@golevelup/ts-jest';

import MemberEntity from '@modules/member/member.entity';
import MemberRepository from '@modules/member/member.repository';
import { MEMBER_LIST } from '@common/testing/fixtures';

describe('MemberRepository', () => {
  let memberRepository: MemberRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MemberRepository,
        {
          provide: DataSource,
          useValue: createMock<DataSource>(),
        },
      ],
    }).compile();
    memberRepository = module.get<MemberRepository>(MemberRepository);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('getMemberByIdWithUser', () => {
    it('should return the member with provided id', async () => {
      const id = 1;
      const member = MEMBER_LIST.find(m => m.id === id);

      const findOneSpy = jest
        .spyOn(memberRepository, 'findOne')
        .mockResolvedValue(member as MemberEntity);

      const returnedMemberWithUser =
        await memberRepository.getMemberByIdWithUser(id);
      expect(returnedMemberWithUser).toEqual(member);
      expect(findOneSpy).toHaveBeenCalledWith({
        where: { id },
        relations: ['user'],
      });
    });
  });
});
