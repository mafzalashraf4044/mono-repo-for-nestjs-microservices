/** @format */

import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';

import { BaseEntity } from '@swiq/common/entities';
import User from '@modules/user/user.entity';
import { MemberDeviceType, MemberGoal } from '@common/enums';
import {
  MemberAppToken,
  MemberDetails,
  MemberMembership,
  MemberPreferences,
} from '@common/interfaces';

@Entity()
export class Member extends BaseEntity {
  @Column({
    type: 'number',
    nullable: false,
  })
  userId: number;

  @OneToOne(() => User, user => user.member)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({
    type: 'jsonb',
    nullable: false,
    default: '{}',
  })
  details: MemberDetails;

  @Column({
    type: 'enum',
    nullable: false,
    enum: MemberGoal,
    default: MemberGoal.Longevity,
  })
  goal: MemberGoal;

  @Column({
    type: 'enum',
    nullable: false,
    enum: MemberDeviceType,
    array: true,
    default: [],
  })
  devices: MemberDeviceType[];

  @Column({
    type: 'jsonb',
    nullable: false,
    default: '{}',
  })
  appToken: MemberAppToken;

  @Column({
    type: 'jsonb',
    nullable: false,
    default: '{}',
  })
  preferences: MemberPreferences;

  @Column({
    type: 'jsonb',
    nullable: true,
    default: null,
  })
  membership: MemberMembership;
}

export default Member;
