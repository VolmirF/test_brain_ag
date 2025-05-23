import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { PrismaService } from '../../database/prisma.service';
import { CreatePlantingDto } from './dtos/create-planting.dto';
import { UpdatePlantingDto } from './dtos/update-planting.dto';
import { GetPlantingsDto } from './dtos/get-plantings.dto';

@Injectable()
export class PlantingsService {
  constructor(private readonly prisma: PrismaService) {}

  private readonly logger = new Logger(PlantingsService.name);

  async getPlantings(params: GetPlantingsDto) {
    try {
      const whereQuery: Prisma.PlantingFindManyArgs['where'] = {
        propertyId: params.propertyId,
        cropId: params.cropId,
        year: params.year,
      };

      const plantings = await this.prisma.planting.findMany({
        where: whereQuery,
        skip: (params.page - 1) * params.pageSize,
        take: params.pageSize,
      });
      const countPlantings = await this.prisma.planting.count({
        where: whereQuery,
      });

      return {
        data: plantings,
        page: params.page,
        pageSize: params.pageSize,
        totalPages: Math.ceil(countPlantings / params.pageSize),
        total: countPlantings,
      };
    } catch (error) {
      this.logger.error('Error fetching plantings: ', error);
      throw error;
    }
  }

  async getPlantingById(id: number) {
    try {
      const planting = await this.prisma.planting.findUnique({
        where: { id },
      });
      if (!planting) throw new NotFoundException('Planting not found');
      return planting;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      this.logger.error('Error fetching planting by ID: ', error);
      throw error;
    }
  }

  async createPlanting(data: CreatePlantingDto) {
    try {
      const property = await this.prisma.property.findFirst({
        where: { id: data.propertyId },
      });
      if (property === null)
        throw new BadRequestException('Property not found');

      const crop = await this.prisma.crops.findFirst({
        where: { id: data.cropId },
      });
      if (crop === null) throw new BadRequestException('Crop not found');

      return await this.prisma.planting.create({
        data,
      });
    } catch (error) {
      if (error instanceof BadRequestException) throw error;
      this.logger.error('Error creating planting: ', error);
      throw error;
    }
  }

  async updatePlanting(id: number, data: UpdatePlantingDto) {
    try {
      if (data.propertyId) {
        const property = await this.prisma.property.findFirst({
          where: { id: data.propertyId },
        });
        if (property === null)
          throw new BadRequestException('Property not found');
      }

      if (data.cropId) {
        const crop = await this.prisma.crops.findFirst({
          where: { id: data.cropId },
        });
        if (crop === null) throw new BadRequestException('Crop not found');
      }

      return await this.prisma.planting.update({
        where: { id },
        data,
      });
    } catch (error) {
      if (error instanceof BadRequestException) throw error;
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error?.code === 'P2025'
      ) {
        throw new NotFoundException('Planting not found');
      }
      this.logger.error('Error updating planting: ', error);
      throw error;
    }
  }

  async deletePlanting(id: number) {
    try {
      await this.prisma.planting.delete({
        where: { id },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error?.code === 'P2025'
      ) {
        throw new NotFoundException('Planting not found');
      }
      this.logger.error('Error deleting planting: ', error);
      throw error;
    }
  }
}
