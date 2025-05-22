import { Injectable } from '@nestjs/common';

import { PrismaService } from 'src/database/prisma.service';
import { CreateCropDto } from './dtos/create-crop.dto';
import { UpdateCropDto } from './dtos/update-crop.dto';
import { GetCropsDto } from './dtos/get-crops.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class CropsService {
  constructor(private readonly prisma: PrismaService) {}

  async getCrops(params: GetCropsDto) {
    const whereQuery: Prisma.CropsFindManyArgs['where'] = {
      name: {
        contains: params.name,
        mode: 'insensitive',
      },
    };

    const crops = await this.prisma.crops.findMany({
      where: whereQuery,
      skip: (params.page - 1) * params.pageSize,
      take: params.pageSize,
    });
    const countCrops = await this.prisma.crops.count({
      where: whereQuery,
    });

    return {
      data: crops,
      page: params.page,
      pageSize: params.pageSize,
      totalPages: Math.ceil(countCrops / params.pageSize),
      total: countCrops,
    };
  }

  async getCropById(id: number) {
    return await this.prisma.crops.findUnique({
      where: { id },
    });
  }

  async createCrop(data: CreateCropDto) {
    return await this.prisma.crops.create({
      data,
    });
  }

  async updateCrop(id: number, data: UpdateCropDto) {
    return await this.prisma.crops.update({
      where: { id },
      data,
    });
  }

  async deleteCrop(id: number) {
    return await this.prisma.crops.delete({
      where: { id },
    });
  }
}
