import { instanceToPlain } from 'class-transformer';
import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { PrismaService } from '../../database/prisma.service';
import { CreateProducerDto } from './dtos/create-producer.dto';
import { UpdateProducerDto } from './dtos/update-producer.dto';
import { GetProducersDto } from './dtos/get-producers.dto';

@Injectable()
export class ProducersService {
  constructor(private readonly prisma: PrismaService) {}

  private readonly logger = new Logger(ProducersService.name);

  async getProducers(params: GetProducersDto) {
    try {
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
    } catch (error) {
      this.logger.error('Error fetching producers: ', error);
      throw error;
    }
  }

  async getProducerById(id: number) {
    try {
      const producer = await this.prisma.producer.findUnique({
        where: { id },
      });
      if (!producer) throw new NotFoundException('Producer not found');
      return producer;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      this.logger.error('Error fetching producer by ID: ', error);
      throw error;
    }
  }

  async createProducer(data: CreateProducerDto) {
    try {
      return await this.prisma.producer.create({
        data: instanceToPlain(data) as CreateProducerDto,
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error?.code === 'P2002'
      ) {
        if (error?.meta?.target?.[0] === 'document')
          throw new BadRequestException(
            `Document already used by another record`,
          );
      }
      this.logger.error('Error creating producer: ', error);
      throw error;
    }
  }

  async updateProducer(id: number, data: UpdateProducerDto) {
    try {
      const producer = await this.prisma.producer.update({
        where: { id },
        data: instanceToPlain(data) as UpdateProducerDto,
      });
      return producer;
    } catch (error: any) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error?.code === 'P2025')
          throw new NotFoundException('Producer not found');
        if (
          error?.code === 'P2002' &&
          error?.meta?.target?.[0] === 'document'
        ) {
          throw new BadRequestException(
            `Document already used by another record`,
          );
        }
      }
      this.logger.error('Error updating producer: ', error);
      throw error;
    }
  }

  async deleteProducer(id: number) {
    try {
      await this.prisma.producer.delete({
        where: { id },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error?.code === 'P2025'
      ) {
        throw new NotFoundException('Producer not found');
      }
      this.logger.error('Error deleting producer: ', error);
      throw error;
    }
  }
}
