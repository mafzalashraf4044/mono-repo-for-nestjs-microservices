import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { createMock } from '@golevelup/ts-jest';

import { KafkaModule } from '@kafka/kafka.module';
import { AppModule } from '../../../app.module';

export class IntegrationTestManager {
  public httpServer: any;

  private app: INestApplication;

  private mockedKafkaModule = createMock<KafkaModule>();

  async beforeAll(): Promise<void> {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
      providers: [
        {
          provide: KafkaModule,
          useValue: this.mockedKafkaModule,
        },
      ],
    }).compile();

    this.app = moduleRef.createNestApplication();
    await this.app.init();
    this.httpServer = this.app.getHttpServer();
  }

  async afterAll() {
    await this.app.close();
  }
}
