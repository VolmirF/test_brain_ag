import { Module } from '@nestjs/common';

import { CropsService } from './crops.service';
import { CropsController } from './crops.controller';
import { PrismaService } from 'src/database/prisma.service';

@Module({
  providers: [CropsService, PrismaService],
  controllers: [CropsController],
  imports: [],
  exports: [],
})
export class CropsModule {}
