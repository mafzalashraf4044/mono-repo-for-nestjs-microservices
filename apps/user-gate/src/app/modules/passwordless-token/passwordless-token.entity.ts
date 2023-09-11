import { Entity, Column, JoinColumn, ManyToOne } from 'typeorm';

import { BaseEntity } from '@swiq/common/entities';
import User from '@modules/user/user.entity';

@Entity()
class PasswordlessAccessToken extends BaseEntity {
  @Column({
    type: 'integer',
  })
  userId: number;

  @Column({
    type: 'integer',
  })
  totalLimit: number;

  @Column({
    type: 'integer',
    default: 0,
  })
  usedLimit: number;

  @Column({
    type: 'varchar',
    length: 50,
    unique: true,
  })
  token: string;

  @Column({
    type: 'timestamp',
  })
  expiration: Date;

  @ManyToOne(() => User, user => user.passwordlessAccessToken, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' })
  user: User;
}

export default PasswordlessAccessToken;
