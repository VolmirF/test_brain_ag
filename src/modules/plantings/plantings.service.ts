import {
  BadRequestException,
  Injectable,
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

  async getPlantings(params: GetPlantingsDto) {
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
  }

  async getPlantingById(id: number) {
    const planting = await this.prisma.planting.findUnique({
      where: { id },
    });
    if (!planting) throw new NotFoundException('Planting not found');
    return planting;
  }

  async createPlanting(data: CreatePlantingDto) {
    const property = await this.prisma.property.findFirst({
      where: { id: data.propertyId },
    });
    if (property === null) throw new BadRequestException('Property not found');

    const crop = await this.prisma.crops.findFirst({
      where: { id: data.cropId },
    });
    if (crop === null) throw new BadRequestException('Crop not found');

    return await this.prisma.planting.create({
      data,
    });
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
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (typeof error === 'object' && error?.code === 'P2025') {
        throw new NotFoundException('Planting not found');
      }
      throw error;
    }
  }

  async deletePlanting(id: number) {
    try {
      await this.prisma.planting.delete({
        where: { id },
      });
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (typeof error === 'object' && error?.code === 'P2025') {
        throw new NotFoundException('Planting not found');
      }
      throw error;
    }
  }
}
