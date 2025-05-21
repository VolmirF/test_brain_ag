import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { PlantingsService } from './plantings.service';
import { CreatePlantingDto } from './dtos/create-planting.dto';
import { UpdatePlantingDto } from './dtos/update-planting.dto';

@Controller('plantings')
export class PlantingsController {
  constructor(private readonly plantingsService: PlantingsService) {}

  @Get()
  getPlantings() {
    return this.plantingsService.getPlantings();
  }

  @Get(':id')
  getPlantingById(@Param('id') id: number) {
    return this.plantingsService.getPlantingById(id);
  }

  @Post()
  createPlanting(@Body() data: CreatePlantingDto) {
    return this.plantingsService.createPlanting(data);
  }

  @Patch(':id')
  updatePlanting(@Param('id') id: number, @Body() data: UpdatePlantingDto) {
    return this.plantingsService.updatePlanting(id, data);
  }

  @Delete(':id')
  deletePlanting(@Param('id') id: number) {
    return this.plantingsService.deletePlanting(id);
  }
}
