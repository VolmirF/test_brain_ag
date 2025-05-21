import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { PropertiesService } from './properties.service';
import { CreatePropertyDto } from './dtos/create-property.dto';

@Controller('properties')
export class PropertiesController {
  constructor(private readonly propertiesService: PropertiesService) {}

  @Get()
  getProperties() {
    return this.propertiesService.getProperties();
  }
  @Get(':id')
  getPropertyById(@Param('id') id: number) {
    return this.propertiesService.getPropertyById(id);
  }
  @Post()
  createProperty(@Body() data: CreatePropertyDto) {
    return this.propertiesService.createProperty(data);
  }
  @Patch(':id')
  updateProperty(@Param('id') id: number, @Body() data: any) {
    return this.propertiesService.updateProperty(id, data);
  }
  @Delete(':id')
  deleteProperty(@Param('id') id: number) {
    return this.propertiesService.deleteProperty(id);
  }
}
