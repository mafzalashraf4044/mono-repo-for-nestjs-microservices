/** @format */

import { Inject, OnModuleInit, Logger, UseGuards } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { lastValueFrom } from 'rxjs';

import { join } from 'path';
import { createWriteStream, existsSync, mkdirSync } from 'fs';
import { Upload, FileUpload, GraphQLUpload } from 'graphql-upload';

import { NotFoundError } from '@swiq/common/errors';
import { RoleAuthGuard } from '@swiq/common/guards';
import { Roles } from '@swiq/common/decorators';
import { MicroServices } from '@swiq/common/enums';
import {
  FindUsersArgs,
  ServiceNameDTO,
  SignupRequest,
} from '@modules/user/dto';
import UserModel from '@modules/user/user.model';
import UserService from '@modules/user/user.service';
import * as HealthService from '@proto/health-journal';

@Resolver(() => UserModel)
class UserResolver implements OnModuleInit {
  healthServiceClient: HealthService.HealthJournalGRPCServiceClient;

  constructor(
    private readonly userService: UserService,
    private readonly logger: Logger,
    // @Inject(MICRO_SERVICES.healthJournal.clientId)
    // private readonly client: ClientKafka,
    @Inject(HealthService.HEALTHJOURNAL_PACKAGE_NAME)
    private readonly grpcClient: ClientGrpc,
  ) {}

  @UseGuards(RoleAuthGuard)
  @Roles('Member')
  @Mutation(() => Boolean, { name: 'uploadImage' })
  async uploadImage(
    @Args({ name: 'image', type: () => GraphQLUpload })
    image: Upload,
    @Args({ name: 'createFileInDirectory', type: () => Boolean })
    createFileInDirectory: boolean,
  ) {
    const file: FileUpload = image.file;

    console.log('UPLOAD_IMAGE_CALLED', {
      file,
      createFileInDirectory,
    });

    return new Promise((resolve, reject) => {
      if (createFileInDirectory) {
        const dirPath = join(__dirname, '/uploads');

        if (!existsSync(dirPath)) {
          mkdirSync(dirPath, { recursive: true });
        }

        file
          .createReadStream()
          .pipe(createWriteStream(`${dirPath}/${file.filename}`))
          .on('finish', () => {
            console.log('IMAGE_CREATED_IN_DIRECTORY');
            resolve(true);
          })
          .on('error', error => {
            console.log('IMAGE_UPLOAD_ERROR', error);
            reject(false);
          });
      } else {
        file
          .createReadStream()
          .on('data', data => {
            console.log('DATE_FROM_STREAM', data);
          })
          .on('end', () => {
            console.log('END_OF_STREAM');
            resolve(true);
          })
          .on('error', error => {
            console.log('IMAGE_UPLOAD_ERROR', error);
            reject(false);
          });
      }
    });
  }

  @Query(() => UserModel)
  async user(@Args('id') id: number): Promise<UserModel> {
    const user = await this.userService.findOneById(id);
    if (!user) {
      throw new NotFoundError();
    }

    this.logger.log('User Found...', JSON.stringify(user));

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
    return user;
  }

  // @Mutation(() => Boolean)
  // async singleUpload(@Args('input') {picture}: PictureDto) {
  //   console.log('hello world', picture);

  //   // ts-ignore
  //   // return new Promise((resolve, reject) =>
  //   //   createReadStream()
  //   //     .pipe(createWriteStream(`./uploads/${filename}`))
  //   //     .on('finish', () => resolve(true))
  //   //     .on('error', () => reject(false)),
  //   // );
  // }

  // @Mutation(() => Boolean, { name: 'uploadImage' })
  // async uploadImage(@Args('input') { imageFile }: UploadImageInput) {
  //   console.log(imageFile)
  //   const { createReadStream, filename } = await imageFile
  //   console.log('filename --->>', filename)
  //   console.log('createReadStream --->>', createReadStream)
  //   const stream = createReadStream()
  //   console.log(stream)
  //   return true
  // }

  @UseGuards(RoleAuthGuard)
  @Roles('Member')
  @Query(() => UserModel)
  async userByEmail(@Args('email') email: string): Promise<UserModel> {
    const user = await this.userService.findByEmail(email);

    if (!user) throw new NotFoundError();

    return user;
  }

  @Query(() => [UserModel])
  users(@Args() findUsersArgs: FindUsersArgs): Promise<UserModel[]> {
    return this.userService.findAll(findUsersArgs);
  }

  @Mutation(() => UserModel)
  async addUser(@Args('user') userInput: SignupRequest): Promise<UserModel> {
    const user = await this.userService.create(userInput);

    // @TODO: For transaction test, remove this test code in future
    const pattern = 'user.meal.transaction';

    // this.client.send(pattern, 2).subscribe(
    //   () => {
    //     console.log(`Got result back from health service`);
    //   },
    //   err => {
    //     console.log(
    //       `Exception Occured in health service: ${JSON.stringify(err)}`,
    //     );
    //   },
    // );

    return user;
  }

  @Mutation(() => Boolean)
  async testGrpcConnectivityWithServices(
    @Args('serviceName') { serviceName }: ServiceNameDTO,
  ): Promise<boolean> {
    if (serviceName === MicroServices.HealthJournal) {
      const data = await lastValueFrom(
        this.healthServiceClient.testGrpc({
          data: 'Whatsup',
        }),
      );
      return data.isWorking;
    }

    return false;
  }

  async onModuleInit() {
    // this.client.subscribeToResponseOf('user.meal.events');
    // this.client.subscribeToResponseOf('user.meal.transaction');
    // await this.client.connect();

    // Initiate healthServiceClient grpc
    this.healthServiceClient =
      this.grpcClient.getService<HealthService.HealthJournalGRPCServiceClient>(
        HealthService.HEALTH_JOURNAL_GR_PC_SERVICE_NAME,
      );
  }
}

export default UserResolver;
