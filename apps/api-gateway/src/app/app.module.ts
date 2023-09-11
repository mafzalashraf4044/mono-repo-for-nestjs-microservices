import { Module } from '@nestjs/common';
import { ConfigModule } from '@config/config.module';

import { FederationModule } from './federation/federation.module';

@Module({
  imports: [ConfigModule, FederationModule],
})
export class AppModule {}
