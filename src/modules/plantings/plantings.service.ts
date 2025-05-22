import { Injectable } from '@nestjs/common';
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
    return await this.prisma.planting.findUnique({
      where: { id },
    });
  }

  async createPlanting(data: CreatePlantingDto) {
    return await this.prisma.planting.create({
      data,
    });
  }

  async updatePlanting(id: number, data: UpdatePlantingDto) {
    return await this.prisma.planting.update({
      where: { id },
      data,
    });
  }

  async deletePlanting(id: number) {
    return await this.prisma.planting.delete({
      where: { id },
    });
  }
}
