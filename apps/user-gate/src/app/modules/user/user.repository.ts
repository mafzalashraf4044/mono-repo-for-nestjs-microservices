import { DataSource, FindOptionsWhere } from 'typeorm';
import { Injectable } from '@nestjs/common';

import { ModelRepository } from '@swiq/common/repositories';
import UserEntity from '@modules/user/user.entity';

@Injectable()
class UserRepository extends ModelRepository<UserEntity> {
  constructor(private dataSource: DataSource) {
    super(UserEntity, dataSource.createEntityManager());
  }

  async findUserWithPassword(
    query: FindOptionsWhere<UserEntity> | FindOptionsWhere<UserEntity>[],
    relations: string[] = [],
  ): Promise<UserEntity> | null {
    const userWithoutPassword = await this.findOne({
      where: {
        ...query,
      },
      relations,
    });

    if (!userWithoutPassword) return null;

    const userWithPassword = await this.createQueryBuilder('user')
      .select('user.id', 'id')
      .addSelect('user.password', 'password')
      .where('user.id = :id', {
        id: userWithoutPassword.id,
      })
      .getRawOne<UserEntity>();

    return {
      ...userWithoutPassword,
      ...userWithPassword,
    };
  }
}

export default UserRepository;
