import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { ProducersModule } from './modules/producers/producers.module';
import configuration from 'config/configuration';
import { validate } from 'config/env.validation';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      validate,
    }),
    ProducersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
