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

import { ProducersService } from './producers.service';
import { CreateProducerDto } from './dtos/create-producer.dto';
import { UpdateProducerDto } from './dtos/update-producer.dto';
import { GetProducersDto } from './dtos/get-producers.dto';

@Controller('producers')
export class ProducersController {
  constructor(private readonly producersService: ProducersService) {}

  @Get()
  @ApiOperation({ summary: 'Get all producers' })
  getProducers(@Query() params: GetProducersDto) {
    return this.producersService.getProducers(params);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get producer by id' })
  getProducerById(@Param('id') id: number) {
    return this.producersService.getProducerById(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create producer' })
  createProducer(@Body() data: CreateProducerDto) {
    return this.producersService.createProducer(data);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update producer' })
  updateProducer(@Param('id') id: number, @Body() data: UpdateProducerDto) {
    return this.producersService.updateProducer(id, data);
  }

  @Delete(':id')
  @HttpCode(204)
  @ApiOperation({ summary: 'Delete producer' })
  deleteProducer(@Param('id') id: number) {
    return this.producersService.deleteProducer(id);
  }
}
