import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';

import { CropsService } from './crops.service';
import { CreateCropDto } from './dtos/create-crop.dto';
import { UpdateCropDto } from './dtos/update-crop.dto';
import { GetCropsDto } from './dtos/get-crops.dto';

@Controller('crops')
export class CropsController {
  constructor(private readonly cropsService: CropsService) {}

  @Get()
  @ApiOperation({ summary: 'Returns all crops' })
  getCrops(@Query() params: GetCropsDto) {
    return this.cropsService.getCrops(params);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Returns a crop by id' })
  getCropById(@Param('id') id: number) {
    return this.cropsService.getCropById(id);
  }

  @Post()
  @ApiOperation({ summary: 'Creates a new crop' })
  createCrop(@Body() data: CreateCropDto) {
    return this.cropsService.createCrop(data);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Updates a crop by id' })
  updateCrop(@Param('id') id: number, @Body() data: UpdateCropDto) {
    return this.cropsService.updateCrop(id, data);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Deletes a crop by id' })
  deleteCrop(@Param('id') id: number) {
    return this.cropsService.deleteCrop(id);
  }
}
