import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';
import { Module } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';

@Module({
  imports: [],
  controllers: [DashboardController],
  providers: [DashboardService, PrismaService],
})
export class DashboardModule {}
