import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { PrismaService } from '../../database/prisma.service';
import { CreateCropDto } from './dtos/create-crop.dto';
import { UpdateCropDto } from './dtos/update-crop.dto';
import { GetCropsDto } from './dtos/get-crops.dto';

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
    const crop = await this.prisma.crops.findUnique({
      where: { id },
    });

    if (!crop) throw new NotFoundException('Crop not found');
    return crop;
  }

  async createCrop(data: CreateCropDto) {
    return await this.prisma.crops.create({
      data,
    });
  }

  async updateCrop(id: number, data: UpdateCropDto) {
    try {
      return await this.prisma.crops.update({
        where: { id },
        data,
      });
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (typeof error === 'object' && error?.code === 'P2025') {
        throw new NotFoundException('Crop not found');
      }
      throw error;
    }
  }

  async deleteCrop(id: number) {
    try {
      await this.prisma.crops.delete({
        where: { id },
      });
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (typeof error === 'object' && error?.code === 'P2025') {
        throw new NotFoundException('Crop not found');
      }
      throw error;
    }
  }
}
