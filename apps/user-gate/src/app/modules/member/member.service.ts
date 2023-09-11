/** @format */

import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { Not, IsNull } from 'typeorm';
import { Transactional } from 'typeorm-transactional';

import { BadRequestError } from '@swiq/common/errors';
import MemberEntity from '@modules/member/member.entity';
import MemberRepository from '@modules/member/member.repository';
import UserService from '@modules/user/user.service';
import {
  LoginRequest,
  SignupRequest,
  ResetPasswordWithCodeRequest,
  ForgotPasswordRequest,
} from '@modules/user/dto';
import { MemberLoginResponse, MemberModel } from '@modules/member/member.model';
import { PasswordlessTokenService } from '@modules/passwordless-token/passwordless-token.service';
import { createPasswordlessToken, getDateAheadOfOneYear } from '@common/utils';
import { UserRole, UserStatus } from '@common/enums';
import {
  INVALID_EMAIL_PASSWORD,
  EMAIL_IS_NOT_CORRECT_ERROR,
} from '@common/errors';
import { NotFoundError } from '@swiq/common/errors';

@Injectable()
class MemberService {
  constructor(
    private readonly memberRepository: MemberRepository,
    private readonly passwordlessTokenService: PasswordlessTokenService,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
  ) {}

  /**
   * Find member by id from member table
   *
   * @param {number} id primary key / id of the member to find
   * @returns {Promise<MemberEntity | undefined>} Will return the member if found
   * @memberof MemberService
   */
  async findOneById(id: number): Promise<MemberEntity | undefined> {
    const member = await this.memberRepository.getEntityById(id);

    if (!member) {
      return Promise.reject(new NotFoundError());
    }

    return member;
  }

  /**
   * Get all members
   *
   * @returns {Promise<MemberEntity[]>} Will return an array of members
   * @memberof MemberService
   */
  async getAll(): Promise<MemberEntity[]> {
    const query = {
      membership: Not(IsNull()),
    };

    return this.memberRepository.getEntities(query);
  }

  /**
   * This method will check if the user is unverified and still not subscribed , So it will
   * return member details. If the user is not found then it will return null. If the user is subscribed
   * then it will return null
   *
   * @param email email belonging to the user
   * @returns member or null
   */
  async checkUserIsNotSubscribedByEmail(
    email: string,
  ): Promise<MemberEntity | null> {
    const existingUser = await this.userService.findByEmail(email);

    if (existingUser) {
      const member = await this.memberRepository.findOneBy({
        userId: existingUser.id,
      });

      const isUserUnsubscribed =
        existingUser.status === UserStatus.NotVerified ||
        (!member.membership?.subscriptionId && !member.membership?.type);

      if (isUserUnsubscribed) return member;
    }

    return null;
  }

  /**
   * This method is to check if the user exists or not and update its verification code then send it to the user by email
   *
   * @param {resetPasswordWithCodeRequest}
   * @returns an updated user entity
   */
  async memberResetPassword(
    resetPasswordWithCodeRequest: ResetPasswordWithCodeRequest,
  ): Promise<void> {
    // check if there is a member by email
    const user = await this.userService.findByEmail(
      resetPasswordWithCodeRequest.email,
    );

    if (!user) throw new BadRequestError(EMAIL_IS_NOT_CORRECT_ERROR);

    // check if user is active
    this.userService.throwIfUserIsNotActive(user);

    // check if the code is ok and didn't expire
    this.userService.throwIfCodeIsNotValid(
      user,
      resetPasswordWithCodeRequest.code,
    );

    // after passing checks update the user password
    await this.userService.updateUserPassword(
      user,
      resetPasswordWithCodeRequest.password,
      resetPasswordWithCodeRequest.confirmPassword,
    );
  }

  /**
   * This method is to check if the user exists or not and update its verification code then send it to the user by email
   *
   * @param {ForgotPasswordRequest}
   * @returns an updated user entity
   */
  async memberForgotPassword(
    forgotPasswordRequest: ForgotPasswordRequest,
  ): Promise<void> {
    // check if there is a member by email
    const user = await this.userService.findByEmail(
      forgotPasswordRequest.email,
    );

    if (!user) throw new BadRequestError(EMAIL_IS_NOT_CORRECT_ERROR);

    // check if user is active
    this.userService.throwIfUserIsNotActive(user);

    // update user's resetPassword data
    await this.userService.updateVerificationCodes(user);

    // @TODO: Send the code via email
  }

  @Transactional()
  async signupMember(memberData: SignupRequest): Promise<MemberModel> {
    // Check if user is not subscribed so resent email
    const existingMember = await this.checkUserIsNotSubscribedByEmail(
      memberData.email,
    );

    if (existingMember) {
      // @TODO: Resend Email

      return existingMember;
    }

    // Create a new user record
    const user = await this.userService.create(memberData);

    // Create a new member record
    const member = await this.memberRepository.save({
      userId: user.id,
    });

    // Create a passwordless access token
    await this.passwordlessTokenService.create({
      userId: user.id,
      token: createPasswordlessToken(),
      expiration: getDateAheadOfOneYear().toDate(),
      totalLimit: 10,
      usedLimit: 0,
    });

    // @TODO: Send Email with join-hinx link

    return member;
  }

  @Transactional()
  async loginMember(loginRequest: LoginRequest): Promise<MemberLoginResponse> {
    const tokens = await this.userService.loginUser(
      {
        email: loginRequest.email,
        password: loginRequest.password,
      },
      UserRole.Member,
    );

    if (!tokens) throw new BadRequestError(INVALID_EMAIL_PASSWORD);

    return tokens;
  }

  @Transactional()
  async refreshMemberAccessToken(refreshToken: string): Promise<string> {
    return await this.userService.refreshAccessTokenForUser(refreshToken);
  }
}

export default MemberService;
