import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import PasswordlessAccessTokenEntity from '@modules/passwordless-token/passwordless-token.entity';
import PasswordlessTokenRepository from '@modules/passwordless-token/passwordless-token.repository';
import { PasswordlessTokenService } from '@modules/passwordless-token/passwordless-token.service';

@Module({
  providers: [PasswordlessTokenService, PasswordlessTokenRepository],
  imports: [TypeOrmModule.forFeature([PasswordlessAccessTokenEntity])],
  exports: [PasswordlessTokenService],
})
export class PasswordlessTokenModule {}
