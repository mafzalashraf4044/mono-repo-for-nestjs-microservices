/** @format */

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmOptionsFactory, TypeOrmModuleOptions } from '@nestjs/typeorm';

import { PgSQLConnectionConfig } from '@swiq/common/interfaces';
import { getTypeOrmOptions } from '@swiq/common/utils';

@Injectable()
export class TypeOrmService implements TypeOrmOptionsFactory {
  private config: PgSQLConnectionConfig;

  constructor(private configService: ConfigService) {
    this.config = {
      host: this.configService.get('db.host'),
      port: this.configService.get('db.port'),
      username: this.configService.get('db.username'),
      password: this.configService.get('db.password'),
      database: this.configService.get('db.database'),
    };
  }

  async createTypeOrmOptions(): Promise<TypeOrmModuleOptions> {
    const env = this.configService.get('env');

    return getTypeOrmOptions(env, this.config);
  }
}
