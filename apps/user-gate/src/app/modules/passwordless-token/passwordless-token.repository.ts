import { DataSource } from 'typeorm';
import { Injectable } from '@nestjs/common';

import PasswordlessTokenEntity from '@modules/passwordless-token/passwordless-token.entity';
import { ModelRepository } from '@swiq/common/repositories';

@Injectable()
class PasswordlessTokenRepository extends ModelRepository<PasswordlessTokenEntity> {
  constructor(private dataSource: DataSource) {
    super(PasswordlessTokenEntity, dataSource.createEntityManager());
  }
}

export default PasswordlessTokenRepository;
