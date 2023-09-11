/** @format */

import { Logger, UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

import { NotFoundError } from '@swiq/common/errors';
import { GENERAL_MESSAGES } from '@swiq/common/constants';
import {
  CheckWebsiteEnvironmentGuard,
  CheckMobileEnvironmentGuard,
} from '@swiq/common';
import { MemberLoginResponse, MemberModel } from '@modules/member/member.model';
import MemberService from '@modules/member/member.service';
import { ResetPasswordWithCodeRequest } from '@modules/user/dto';
import {
  ForgotPasswordRequest,
  LoginRequest,
  SignupRequest,
} from '@modules/user/dto';
@Resolver(() => MemberModel)
class MemberResolver {
  constructor(
    private readonly memberService: MemberService,
    private readonly logger: Logger,
    // @Inject(MICRO_SERVICES.healthJournal.clientId)
    // private readonly client: ClientKafka,
  ) {}

  @Query(() => MemberModel)
  async member(@Args('id') id: number): Promise<MemberModel> {
    const member = await this.memberService.findOneById(id);
    if (!member) {
      throw new NotFoundError();
    }

    this.logger.log('Member Found...', member);

    // microservice communication example
    // const pattern = 'user.meal.events';
    // const data = [1, 2, 3, 4, 5];
    // const startTime = Date.now();
    // this.client.send<number>(pattern, data).subscribe(value => {

    //   const endTime = Date.now();

    //   // Calculate the time duration
    //   const timeDuration = endTime - startTime;

    //   // Log the time duration
    //   console.log(`The task took ${timeDuration} milliseconds to complete.`);
    // });
    return member;
  }

  @Mutation(() => MemberModel)
  @UseGuards(CheckWebsiteEnvironmentGuard)
  async signupMember(
    @Args('signupRequest') signupRequest: SignupRequest,
  ): Promise<MemberModel> {
    return await this.memberService.signupMember(signupRequest);
  }

  @Mutation(() => String)
  @UseGuards(CheckMobileEnvironmentGuard)
  async resetMemberPassword(
    @Args('resetPasswordWithCodeRequest')
    resetPasswordWithCodeRequest: ResetPasswordWithCodeRequest,
  ): Promise<string> {
    await this.memberService.memberResetPassword(resetPasswordWithCodeRequest);
    return GENERAL_MESSAGES.UserPasswordUpdated;
  }

  /**
   * @TODO: This mutation is for testing purpose only , It checks whether the password is being generated
   * correctly in signupMember mutation and the password is being compared properly with hash. This
   * function should return true when email and password are correct and return false when not
   *
   * @param email email of member
   * @param password password of member
   * @returns boolean
   */
  @Mutation(() => Boolean)
  @UseGuards(CheckMobileEnvironmentGuard)
  @Mutation(() => String)
  async forgotMemberPassword(
    @Args('forgotPasswordRequest') forgotPasswordRequest: ForgotPasswordRequest,
  ): Promise<string> {
    await this.memberService.memberForgotPassword(forgotPasswordRequest);
    return GENERAL_MESSAGES.UpdatedUserVerificationCodes;
  }

  @Mutation(() => MemberLoginResponse)
  @UseGuards(CheckMobileEnvironmentGuard)
  async loginMember(
    @Args('loginRequest') loginRequest: LoginRequest,
  ): Promise<MemberLoginResponse> {
    return await this.memberService.loginMember(loginRequest);
  }

  @Mutation(() => String)
  @UseGuards(CheckMobileEnvironmentGuard)
  async refreshMemberAccessToken(
    @Args('refreshToken') refreshToken: string,
  ): Promise<string> {
    return await this.memberService.refreshMemberAccessToken(refreshToken);
  }

  // async onModuleInit() {
    // this.client.subscribeToResponseOf('user.meal.events');
    // await this.client.connect();
  // }
}

export default MemberResolver;
