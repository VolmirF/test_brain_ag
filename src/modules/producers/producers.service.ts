import { instanceToPlain } from 'class-transformer';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { PrismaService } from '../../database/prisma.service';
import { CreateProducerDto } from './dtos/create-producer.dto';
import { UpdateProducerDto } from './dtos/update-producer.dto';
import { GetProducersDto } from './dtos/get-producers.dto';

@Injectable()
export class ProducersService {
  constructor(private readonly prisma: PrismaService) {}

  async getProducers(params: GetProducersDto) {
    const whereQuery: Prisma.ProducerFindManyArgs['where'] = {
      name: {
        contains: params.name,
        mode: 'insensitive',
      },
      document: params.document,
      documentType: params.documentType,
      state: params.state,
    };

    const producers = await this.prisma.producer.findMany({
      where: whereQuery,
      skip: (params.page - 1) * params.pageSize,
      take: params.pageSize,
    });

    const producersCount = await this.prisma.producer.count({
      where: whereQuery,
    });

    return {
      data: producers,
      page: params.page,
      pageSize: params.pageSize,
      totalPages: Math.ceil(producersCount / params.pageSize),
      total: producersCount,
    };
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
