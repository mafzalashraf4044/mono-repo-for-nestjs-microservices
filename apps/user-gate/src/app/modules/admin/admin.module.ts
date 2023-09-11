import { Logger, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import UserEntity from '@modules/user/user.entity';
import AdminEntity from '@modules/admin/admin.entity';
import AdminResolver from '@modules/admin/admin.resolver';
import AdminService from '@modules/admin/admin.service';
import AdminRepository from '@modules/admin/admin.repository';

@Module({
  providers: [AdminResolver, AdminService, AdminRepository, Logger],
  imports: [TypeOrmModule.forFeature([UserEntity, AdminEntity])],
  exports: [TypeOrmModule],
})
class AdminModule {}

export default AdminModule;
