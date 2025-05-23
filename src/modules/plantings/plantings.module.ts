import { Module } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

import { PlantingsService } from './plantings.service';
import { PlantingsController } from './plantings.controller';

@Module({
  imports: [],
  controllers: [PlantingsController],
  providers: [PlantingsService, PrismaService],
})
export class PlantingsModule {}
