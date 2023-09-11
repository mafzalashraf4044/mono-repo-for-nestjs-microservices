import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { graphqlUploadExpress } from 'graphql-upload';

import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get<ConfigService>(ConfigService);

  const port = configService.get<number>('PORT', 4000);

  app.use(
    '/graphql',
    graphqlUploadExpress({ maxFileSize: 1000000, maxFiles: 10 }),
  );
  await app.listen(port, '0.0.0.0');

  Logger.log(`🚀 Application is running on: http://localhost:${port}`);
}
bootstrap();
