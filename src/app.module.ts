import { PlantingsModule } from './modules/plantings/plantings.module';
import { PropertiesModule } from './modules/properties/properties.module';
import { CropsModule } from './modules/crops/crops.module';
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
    PropertiesModule,
    CropsModule,
    ProducersModule,
    PlantingsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
