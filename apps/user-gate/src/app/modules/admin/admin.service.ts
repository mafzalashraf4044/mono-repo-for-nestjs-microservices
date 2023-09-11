/** @format */

import { Injectable } from '@nestjs/common';

import AdminEntity from '@modules/admin/admin.entity';
import AdminRepository from '@modules/admin/admin.repository';

@Injectable()
class AdminService {
  constructor(private readonly adminRepository: AdminRepository) {}

  /**
   * Find admin by id from admin table
   *
   * @param {number} id primary key / id of the admin to find
   * @returns {Promise<AdminEntity | undefined>} Will return the admin if found
   * @memberof AdminService
   */
  async findOneById(id: number): Promise<AdminEntity | undefined> {
    return this.adminRepository.getEntityById(id);
  }
}

export default AdminService;
