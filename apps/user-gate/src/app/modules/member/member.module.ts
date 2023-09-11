import { Logger, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import MemberResolver from '@modules/member/member.resolver';
import MemberService from '@modules/member/member.service';
import MemberRepository from '@modules/member/member.repository';
import MemberEntity from '@modules/member/member.entity';
import UserEntity from '@modules/user/user.entity';
import { PasswordlessTokenModule } from '@modules/passwordless-token/passwordless-token.module';

@Module({
  providers: [MemberResolver, MemberService, MemberRepository, Logger],
  imports: [
    TypeOrmModule.forFeature([UserEntity, MemberEntity]),
    PasswordlessTokenModule,
  ],
  exports: [TypeOrmModule, MemberService],
})
class MemberModule {}

export default MemberModule;
