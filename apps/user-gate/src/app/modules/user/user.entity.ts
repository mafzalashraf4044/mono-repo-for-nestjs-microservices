/** @format */

import { Column, Entity, Index, OneToMany, OneToOne } from 'typeorm';
import { IsUrl } from 'class-validator';

import { BaseEntity } from '@swiq/common/entities';
import { EncryptColumn } from '@swiq/common/transformers';
import Member from '@modules/member/member.entity';
import Admin from '@modules/admin/admin.entity';
import { UserRole, UserStatus } from '@common/enums';
import { UserVerificationCode } from '@common/interfaces';
import PasswordlessAccessToken from '@modules/passwordless-token/passwordless-token.entity';

@Entity()
class User extends BaseEntity {
  @Column({
    type: 'varchar',
    nullable: false,
    length: 50,
    default: '',
  })
  firstName: string;

  @Column({
    type: 'varchar',
    nullable: false,
    length: 50,
    default: '',
  })
  lastName: string;

  @Index()
  @Column({
    type: 'varchar',
    nullable: false,
    unique: true,
    length: 100,
    transformer: new EncryptColumn(),
  })
  email: string;

  @Column({
    type: 'varchar',
    nullable: true,
    unique: true,
  })
  username: string;

  @Column({
    type: 'varchar',
    nullable: false,
    length: 100,
    default: '',
    select: false,
  })
  password: string;

  @Column({
    type: 'varchar',
    nullable: false,
    length: 50,
    default: '',
  })
  country: string;

  @Column({
    type: 'jsonb',
    nullable: true,
  })
  verificationCodes: UserVerificationCode;

  @Column({
    type: 'enum',
    enum: UserStatus,
    nullable: false,
    default: 'NotVerified',
  })
  status: UserStatus;

  @Column({
    type: 'varchar',
    nullable: true,
    length: 255,
  })
  @IsUrl()
  photo: string;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  refreshToken: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    nullable: false,
    default: UserRole.Member,
  })
  createdBy: UserRole;

  @OneToOne(() => Member, member => member.user, {
    onDelete: 'CASCADE',
  })
  member: Member;

  @OneToOne(() => Admin, {
    onDelete: 'CASCADE',
  })
  admin: Admin;

  @OneToMany(
    () => PasswordlessAccessToken,
    passwordlessAccessToken => passwordlessAccessToken.user,
    {
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
  )
  passwordlessAccessToken: PasswordlessAccessToken;
}

export default User;
