import { DataSource } from 'typeorm';
import { Injectable } from '@nestjs/common';

import AdminEntity from '@modules/admin/admin.entity';
import { ModelRepository } from '@swiq/common/repositories';

@Injectable()
class AdminRepository extends ModelRepository<AdminEntity> {
  constructor(private dataSource: DataSource) {
    super(AdminEntity, dataSource.createEntityManager());
  }
}

export default AdminRepository;
