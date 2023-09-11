/** @format */

import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { Transactional } from 'typeorm-transactional';
import { JwtService } from '@nestjs/jwt';

import {
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
} from '@swiq/common/errors';
import {
  getRandomSixDigitString,
  getUtcDateOneHourFromNow,
  compareDateWithUtc,
  comparePasswordWithHash,
  hashPassword,
} from '@swiq/common/utils';
import { FindUsersArgs, LoginRequest, SignupRequest } from '@modules/user/dto';
import UserEntity from '@modules/user/user.entity';
import UserRepository from '@modules/user/user.repository';
import MemberService from '@modules/member/member.service';
import { MemberLoginResponse } from '@modules/member/member.model';
import { UserRole, UserStatus } from '@common/enums';
import { LoginUserResponse } from '@common/interfaces';
import {
  EMAIL_ALREADY_EXISTS,
  USERNAME_ALREADY_EXISTS,
  INVALID_REFRESH_TOKEN,
  PASSWORDS_DONT_MATCH,
  USER_NOT_ACTIVE_ERROR,
  VERIFICATION_CODE_NOT_VALID,
} from '@common/errors';

@Injectable()
class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    @Inject(forwardRef(() => MemberService))
    private readonly memberService: MemberService,
    private readonly jwtService: JwtService,
  ) {}

  getPlainToUserForCreate(userCreatePayload: SignupRequest): UserEntity {
    return plainToClass(UserEntity, {
      ...userCreatePayload,
    });
  }

  async checkUserExistWithEmailOrUserName(email: string, username: string) {
    const currentUser = await this.userRepository.findOne({
      where: [
        { email, status: UserStatus.Active },
        { username, status: UserStatus.Active },
      ],
    });

    if (currentUser && currentUser.email === email)
      throw new BadRequestError(EMAIL_ALREADY_EXISTS);
    if (currentUser && currentUser.username === username)
      throw new BadRequestError(USERNAME_ALREADY_EXISTS);
  }

  /**
   * Create a new user in user table
   *
   * @param {SignupRequest} signupRequest payload for creating a new user
   * @returns {Promise<UserEntity>} The created user record.
   * @memberof UsersService
   */
  async create(signupRequest: SignupRequest): Promise<UserEntity> {
    // Check if the email or username has already been used and throw error
    await this.checkUserExistWithEmailOrUserName(
      signupRequest.email,
      signupRequest.username,
    );

    // Hash the password
    signupRequest.password = await hashPassword(signupRequest.password);

    const user = this.getPlainToUserForCreate(signupRequest);

    return await this.userRepository.createEntity(user);
  }

  async updateUserEmail(id: number, email: string): Promise<UserEntity> {
    const user = await this.userRepository.findOne({
      where: {
        id,
      },
    });

    if (!user) throw new NotFoundError();

    user.email = email;

    await this.userRepository.save(user);

    return user;
  }

  async updateVerificationCodes(user: UserEntity): Promise<UserEntity> {
    const code = getRandomSixDigitString();
    const oneHourFromNowString = getUtcDateOneHourFromNow();

    // save code and date to the user object
    user.verificationCodes.resetPassword.code = code;
    user.verificationCodes.resetPassword.expiration = oneHourFromNowString;

    // update user in db
    await this.userRepository.save(user);

    return user;
  }

  /**
   * Find user by id from user table
   *
   * @param {number} id primary key / id of the user to find
   * @returns {Promise<UserEntity | undefined>} Will return the user if found
   * @memberof UsersService
   */
  async findOneById(id: number): Promise<UserEntity | undefined> {
    return this.userRepository.getEntityById(id);
  }

  /**
   * find multiple users based on search criteria
   * @param {FindUsersArgs} args Arguments to find multiple users
   * @returns {Promise<UserEntity[]} List of users matching the search criteria
   * @memberof UsersService
   */
  async findAll(args: FindUsersArgs): Promise<UserEntity[]> {
    return this.userRepository.getEntities(args);
  }

  async findByEmail(email: string): Promise<UserEntity> {
    const user = await this.userRepository.findOneBy({
      email,
    });
    // if not found then throw an error with code 400
    if (!user) return null;

    return user;
  }

  throwIfUserIsNotActive(user: UserEntity) {
    if (user.status !== UserStatus.Active) {
      throw new BadRequestError(USER_NOT_ACTIVE_ERROR);
    }
  }

  async getUserIfLoginCredentialsAreValid(
    email: string,
    password: string,
  ): Promise<UserEntity> {
    const user = await this.userRepository.findUserWithPassword(
      {
        email,
        status: UserStatus.Active,
      },
      ['member'],
    );

    if (!user) return null;

    if (comparePasswordWithHash(password, user.password)) {
      return user;
    }

    return null;
  }

  async updateUserPassword(
    user: UserEntity,
    password: string,
    confirmPassword: string,
  ): Promise<void> {
    // check if the password and confirm password match
    if (password !== confirmPassword) {
      throw new BadRequestError(PASSWORDS_DONT_MATCH);
    }
    // hash the password
    user.password = await hashPassword(password);
    // save the user
    await this.userRepository.save(user);
  }

  throwIfCodeIsNotValid(user: UserEntity, code: string) {
    // generate a new expiration date for the code (an hour from now)
    if (
      code === user.verificationCodes.resetPassword.code &&
      // make sure current date is less than the expiration date.
      compareDateWithUtc(user.verificationCodes.resetPassword.expiration)
    ) {
      throw new BadRequestError(VERIFICATION_CODE_NOT_VALID);
    }
  }

  async generateLoginTokensForMember(
    userId: number,
    memberId: number,
    role: UserRole,
  ): Promise<LoginUserResponse> {
    const payload = {
      userId,
      memberId,
      role,
    };

    const jwtToken = await this.jwtService.signAsync(payload, {
      expiresIn: '1h',
    });
    const refreshToken = await this.jwtService.signAsync(payload, {
      expiresIn: '90d',
    });

    return {
      jwtToken,
      refreshToken,
    };
  }

  @Transactional()
  async loginUser(
    loginRequest: LoginRequest,
    loginType: UserRole,
  ): Promise<MemberLoginResponse | null> {
    const { email, password } = loginRequest;

    const user = await this.getUserIfLoginCredentialsAreValid(email, password);

    if (!user) return null;

    if (loginType === UserRole.Member) {
      const tokens = await this.generateLoginTokensForMember(
        user.id,
        user.member.id,
        UserRole.Member,
      );

      const { member, ...userWithoutMember } = user;

      return {
        jwtToken: tokens.jwtToken,
        refreshToken: tokens.refreshToken,
        member: {
          ...member,
          user: userWithoutMember,
        },
      };
    }

    return null;
  }

  async validateToken(token: string): Promise<any | null> {
    try {
      return await this.jwtService.verifyAsync(token);
    } catch {
      return null;
    }
  }

  async generateAccessTokenForUser(
    userId: number,
    memberIdOrAdminId: number,
    role: UserRole,
  ): Promise<string> {
    const payload = {
      userId,
      role,
    };

    if (role === UserRole.Member) {
      payload['memberId'] = memberIdOrAdminId;
    } else if (role === UserRole.Admin) {
      payload['adminId'] = memberIdOrAdminId;
    }

    return this.jwtService.signAsync(payload, {
      expiresIn: '1h',
    });
  }

  async refreshAccessTokenForUser(refreshToken: string): Promise<string> {
    const payload = await this.validateToken(refreshToken);
    if (!payload) throw new UnauthorizedError(INVALID_REFRESH_TOKEN);

    const { userId, memberId, adminId, role } = payload;

    if (role === UserRole.Member) {
      return this.generateAccessTokenForUser(userId, memberId, role);
    } else if (role === UserRole.Admin) {
      return this.generateAccessTokenForUser(userId, adminId, role);
    }
  }
}

export default UserService;
