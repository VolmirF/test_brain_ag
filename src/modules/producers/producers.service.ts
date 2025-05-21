import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateProducerDto } from './dtos/create-producer.dto';
import { UpdateProducerDto } from './dtos/update-producer.dto';
import { instanceToPlain } from 'class-transformer';

@Injectable()
export class ProducersService {
  constructor(private prisma: PrismaService) {}

  async getProducers() {
    return await this.prisma.producer.findMany({});
  }

  async getProducerById(id: number) {
    return await this.prisma.producer.findUnique({
      where: { id },
    });
  }

  async createProducer(data: CreateProducerDto) {
    return await this.prisma.producer.create({
      data: instanceToPlain(data) as CreateProducerDto,
    });
  }

  async updateProducer(id: number, data: UpdateProducerDto) {
    return await this.prisma.producer.update({
      where: { id },
      data: instanceToPlain(data) as UpdateProducerDto,
    });
  }

  async deleteProducer(id: number) {
    return await this.prisma.producer.delete({
      where: { id },
    });
  }
}
