import { PropertiesService } from './properties.service';
import { Module } from '@nestjs/common';

import { PropertiesController } from './properties.controller';
import { PrismaService } from 'src/database/prisma.service';

@Module({
  imports: [],
  controllers: [PropertiesController],
  providers: [PropertiesService, PrismaService],
})
export class PropertiesModule {}
