import { Module } from '@nestjs/common';
import { ProducersService } from './producers.service';
import { ProducersController } from './producers.controller';
import { PrismaService } from '../../database/prisma.service';

@Module({
  providers: [ProducersService, PrismaService],
  controllers: [ProducersController],
  exports: [],
})
export class ProducersModule {}
