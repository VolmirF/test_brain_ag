import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';

import { CropsService } from './crops.service';
import { CreateCropDto } from './dtos/create-crop.dto';
import { UpdateCropDto } from './dtos/update-crop.dto';

@Controller('crops')
export class CropsController {
  constructor(private readonly cropsService: CropsService) {}

  @Get()
  getCrops() {
    return this.cropsService.getCrops();
  }

  @Get(':id')
  getCropById(@Param('id') id: number) {
    return this.cropsService.getCropById(id);
  }

  @Post()
  createCrop(@Body() data: CreateCropDto) {
    return this.cropsService.createCrop(data);
  }

  @Patch(':id')
  updateCrop(@Param('id') id: number, @Body() data: UpdateCropDto) {
    return this.cropsService.updateCrop(id, data);
  }

  @Delete(':id')
  deleteCrop(@Param('id') id: number) {
    return this.cropsService.deleteCrop(id);
  }
}
