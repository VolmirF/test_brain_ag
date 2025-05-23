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

import { PropertiesService } from './properties.service';
import { CreatePropertyDto } from './dtos/create-property.dto';
import { UpdatePropertyDto } from './dtos/update-property.dto';
import { ApiOperation } from '@nestjs/swagger';
import { GetPropertiesDto } from './dtos/get-properties.dto';

@Controller('properties')
export class PropertiesController {
  constructor(private readonly propertiesService: PropertiesService) {}

  @Get()
  @ApiOperation({ summary: 'List all properties' })
  getProperties(@Query() params: GetPropertiesDto) {
    return this.propertiesService.getProperties(params);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get property by id' })
  getPropertyById(@Param('id') id: number) {
    return this.propertiesService.getPropertyById(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create property' })
  createProperty(@Body() data: CreatePropertyDto) {
    return this.propertiesService.createProperty(data);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update property' })
  updateProperty(@Param('id') id: number, @Body() data: UpdatePropertyDto) {
    return this.propertiesService.updateProperty(id, data);
  }

  @Delete(':id')
  @HttpCode(204)
  @ApiOperation({ summary: 'Delete property' })
  deleteProperty(@Param('id') id: number) {
    return this.propertiesService.deleteProperty(id);
  }
}
