import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { DashboardModule } from './modules/dashboard/dashboard.module';
import { PlantingsModule } from './modules/plantings/plantings.module';
import { PropertiesModule } from './modules/properties/properties.module';
import { CropsModule } from './modules/crops/crops.module';
import { ProducersModule } from './modules/producers/producers.module';

import configuration from '../config/configuration';
import { validate } from '../config/env.validation';
import { AppLoggerMiddleware } from './middlewares/appLogger.middleware';

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
    DashboardModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(AppLoggerMiddleware).forRoutes('*');
  }
}
