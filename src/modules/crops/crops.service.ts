import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { PrismaService } from '../../database/prisma.service';
import { CreateCropDto } from './dtos/create-crop.dto';
import { UpdateCropDto } from './dtos/update-crop.dto';
import { GetCropsDto } from './dtos/get-crops.dto';

@Injectable()
export class CropsService {
  constructor(private readonly prisma: PrismaService) {}

  private readonly logger = new Logger(CropsService.name);

  async getCrops(params: GetCropsDto) {
    try {
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
    } catch (error) {
      this.logger.error('Error fetching crops: ', error);
      throw error;
    }
  }

  async getCropById(id: number) {
    try {
      const crop = await this.prisma.crops.findUnique({
        where: { id },
      });

      if (!crop) throw new NotFoundException('Crop not found');
      return crop;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;

      this.logger.error('Error fetching crop by ID: ', error);
      throw error;
    }
  }

  async createCrop(data: CreateCropDto) {
    try {
      return await this.prisma.crops.create({
        data,
      });
    } catch (error) {
      this.logger.error('Error creating crop: ', error);
      throw error;
    }
  }

  async updateCrop(id: number, data: UpdateCropDto) {
    try {
      return await this.prisma.crops.update({
        where: { id },
        data,
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error?.code === 'P2025'
      ) {
        throw new NotFoundException('Crop not found');
      }
      this.logger.error('Error updating crop: ', error);
      throw error;
    }
  }

  async deleteCrop(id: number) {
    try {
      await this.prisma.crops.delete({
        where: { id },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error?.code === 'P2025'
      ) {
        throw new NotFoundException('Crop not found');
      }
      this.logger.error('Error deleting crop: ', error);
      throw error;
    }
  }
}
