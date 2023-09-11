/** @format */

import { Module, Logger, Global } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

import { AuthConfig } from '@swiq/common/interfaces';
import UserResolver from '@modules/user/user.resolver';
import UserService from '@modules/user/user.service';
import UserEntity from '@modules/user/user.entity';
import UserRepository from '@modules/user/user.repository';
import UserController from '@modules/user/user.controller';
import MemberEntity from '@modules/member/member.entity';
import MemberModule from '@modules/member/member.module';
import { ConfigModule } from '@config/config.module';

@Global()
@Module({
  providers: [UserResolver, UserService, UserRepository, Logger],
  imports: [
    ConfigModule,
    MemberModule,
    TypeOrmModule.forFeature([UserEntity, MemberEntity]),
    PassportModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        return {
          secret: configService.get<AuthConfig>('authConfig').jwtSecret,
        };
      },
    }),
  ],
  exports: [TypeOrmModule, UserService],
  controllers: [UserController],
})
class UserModule {}

export default UserModule;
