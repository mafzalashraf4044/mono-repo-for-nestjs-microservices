/** @format */

import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';

import { BaseEntity } from '@swiq/common/entities';
import User from '@modules/user/user.entity';
import { AdminDetails, AdminPreferences } from '@common/interfaces';

@Entity()
export class Admin extends BaseEntity {
  @Column({
    type: 'number',
    nullable: false,
  })
  userId: number;

  @OneToOne(() => User, user => user.admin)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({
    type: 'jsonb',
    nullable: false,
    default: '{}',
  })
  details: AdminDetails;

  @Column({
    type: 'jsonb',
    nullable: false,
    default: '{}',
  })
  preferences: AdminPreferences;
}

export default Admin;
