/** @format */

import { Logger } from '@nestjs/common';
import { Args, Query, Resolver } from '@nestjs/graphql';

// import { MICRO_SERVICES } from '@swiq/common/constants';
import { NotFoundError } from '@swiq/common/errors';
import AdminModel from '@modules/admin/admin.model';
import AdminService from '@modules/admin/admin.service';

@Resolver(() => AdminModel)
class AdminResolver {
  constructor(
    private readonly adminService: AdminService,
    private readonly logger: Logger,
    // @Inject(MICRO_SERVICES.healthJournal.clientId)
    // private readonly client: ClientKafka,
  ) {}

  @Query(() => AdminModel)
  async admin(@Args('id') id: number): Promise<AdminModel> {
    const admin = await this.adminService.findOneById(id);
    if (!admin) {
      throw new NotFoundError();
    }

    this.logger.log('Admin Found...', admin);

    // microservice communication example
    // const pattern = 'user.meal.events';
    // const data = [1, 2, 3, 4, 5];
    // const startTime = Date.now();
    // this.client.send<number>(pattern, data).subscribe(value => {
    //   console.log(value); // output: "Hello, world!"

    //   const endTime = Date.now();

    //   // Calculate the time duration
    //   const timeDuration = endTime - startTime;

    //   // Log the time duration
    //   console.log(`The task took ${timeDuration} milliseconds to complete.`);
    // });
    return admin;
  }
}

export default AdminResolver;
