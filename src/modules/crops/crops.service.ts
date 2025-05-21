import { Injectable } from '@nestjs/common';

import { PrismaService } from 'src/database/prisma.service';
import { CreateCropDto } from './dtos/create-crop.dto';
import { UpdateCropDto } from './dtos/update-crop.dto';

@Injectable()
export class CropsService {
  constructor(private prisma: PrismaService) {}

  async getCrops() {
    return await this.prisma.crops.findMany({});
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
