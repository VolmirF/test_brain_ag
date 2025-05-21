import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ProducersService } from './producers.service';
import { CreateProducerDto } from './dto/create-producer.dto';
import { UpdateProducerDto } from './dto/update-producer.dto';
import { Producer } from '@prisma/client';

@Controller('producers')
export class ProducersController {
  constructor(private readonly producersService: ProducersService) {}

  @Get()
  getProducers(): Promise<Producer[]> {
    return this.producersService.getProducers();
  }

  @Get(':id')
  getProducerById(@Param('id') id: number) {
    return this.producersService.getProducerById(id);
  }

  @Post()
  createProducer(@Body() data: CreateProducerDto) {
    return this.producersService.createProducer(data);
  }

  @Patch(':id')
  updateProducer(@Param('id') id: number, @Body() data: UpdateProducerDto) {
    return this.producersService.updateProducer(id, data);
  }

  @Delete(':id')
  deleteProducer(@Param('id') id: number) {
    return this.producersService.deleteProducer(id);
  }
}
