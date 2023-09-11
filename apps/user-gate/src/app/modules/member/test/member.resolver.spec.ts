import gql from 'graphql-tag';
import request from 'supertest-graphql';

import { IntegrationTestManager } from '@common/testing/setup/IntegrationTestingManager';

import { MemberModel } from '@modules/member/member.model';

describe('MemberResolver', () => {
  const integrationTestManager = new IntegrationTestManager();

  beforeAll(async () => {
    await integrationTestManager.beforeAll();
  });

  afterAll(async () => {
    await integrationTestManager.afterAll();
  });

  describe('signupMember', () => {
    test('should create a new member successfully', async () => {
      // let createdUser: User;

      const response = await request<{ member: MemberModel }>(
        integrationTestManager.httpServer,
      )
        .mutate(
          gql`
            mutation SignupMember($sigupRequest: SignupRequest!) {
              signupMember(sigupRequest: $sigupRequest) {
                id
                userId
              }
            }
          `,
        )
        .variables({
          createUserData: {
            firstName: "John",
            lastName: "Doe",
            email: "johndoe44@example.com",
            password: "Afzal12345%",
            username: "johndoe44",
            country: "Pakistan",
            phone: "+11112221234"
          },
        })
        .expectNoErrors();


      console.log('RESPONSE', response);
      // createdUser = response.data.createUser;

      // expect(createdUser).toMatchObject({
      //   email: userStub.email,
      // });
    });
  });
});
