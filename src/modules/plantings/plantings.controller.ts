import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';

import { PlantingsService } from './plantings.service';
import { CreatePlantingDto } from './dtos/create-planting.dto';
import { UpdatePlantingDto } from './dtos/update-planting.dto';
import { GetPlantingsDto } from './dtos/get-plantings.dto';

@Controller('plantings')
export class PlantingsController {
  constructor(private readonly plantingsService: PlantingsService) {}

  @Get()
  @ApiOperation({
    summary: 'Get all plantings',
    description: 'Get all plantings',
  })
  getPlantings(@Query() query: GetPlantingsDto) {
    return this.plantingsService.getPlantings(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a planting by id' })
  getPlantingById(@Param('id') id: number) {
    return this.plantingsService.getPlantingById(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new planting' })
  createPlanting(@Body() data: CreatePlantingDto) {
    return this.plantingsService.createPlanting(data);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a planting by id' })
  updatePlanting(@Param('id') id: number, @Body() data: UpdatePlantingDto) {
    return this.plantingsService.updatePlanting(id, data);
  }

  @Delete(':id')
  @HttpCode(204)
  @ApiOperation({ summary: 'Delete a planting by id' })
  deletePlanting(@Param('id') id: number) {
    return this.plantingsService.deletePlanting(id);
  }
}
