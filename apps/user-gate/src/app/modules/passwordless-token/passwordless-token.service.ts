import { Injectable } from '@nestjs/common';
import { plainToClass } from 'class-transformer';

import PasswordlessTokenRepository from '@modules/passwordless-token/passwordless-token.repository';
import PasswordlessAccessTokenEntity from '@modules/passwordless-token/passwordless-token.entity';
import { CreatePasswordlessTokenPayload } from '@common/interfaces/passwordless-token.interfaces';

@Injectable()
export class PasswordlessTokenService {
  constructor(
    private readonly passwordlessTokenRepository: PasswordlessTokenRepository,
  ) {}

  getPlainToPasswordlessTokenForCreate(
    passwordlessTokenCreatePayload: CreatePasswordlessTokenPayload,
  ): PasswordlessAccessTokenEntity {
    return plainToClass(PasswordlessAccessTokenEntity, {
      ...passwordlessTokenCreatePayload,
    });
  }

  async create(
    passwordlessTokenCreatePayload: CreatePasswordlessTokenPayload,
  ): Promise<PasswordlessAccessTokenEntity> {
    const passwordlessToken = this.getPlainToPasswordlessTokenForCreate(
      passwordlessTokenCreatePayload,
    );
    return await this.passwordlessTokenRepository.createEntity(
      passwordlessToken,
    );
  }
}
