import { Controller, Get, HttpCode } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { ApiOperation } from '@nestjs/swagger';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get()
  @HttpCode(204)
  @ApiOperation({ summary: 'Get dashboard info' })
  getDashboardInfo() {
    return this.dashboardService.getDashboardInfo();
  }
}
