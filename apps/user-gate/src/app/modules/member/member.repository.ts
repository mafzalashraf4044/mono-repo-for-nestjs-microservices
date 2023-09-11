import { DataSource } from 'typeorm';
import { Injectable } from '@nestjs/common';

import MemberEntity from '@modules/member/member.entity';
import { ModelRepository } from '@swiq/common/repositories';

@Injectable()
class MemberRepository extends ModelRepository<MemberEntity> {
  constructor(private dataSource: DataSource) {
    super(MemberEntity, dataSource.createEntityManager());
  }

  // @TODO: We will remove this function later
  async getMemberByIdWithUser(id: number): Promise<MemberEntity | null> {
    return await this.findOne({
      where: { id },
      relations: ['user'],
    })
      .then(entity => {
        return Promise.resolve(entity);
      })
      .catch(error => Promise.reject(error));
  }
}

export default MemberRepository;
