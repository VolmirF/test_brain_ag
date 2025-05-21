import { Injectable } from '@nestjs/common';

import { PrismaService } from 'src/database/prisma.service';
import { CreatePlantingDto } from './dtos/create-planting.dto';
import { UpdatePlantingDto } from './dtos/update-planting.dto';

@Injectable()
export class PlantingsService {
  constructor(private readonly prisma: PrismaService) {}

  async getPlantings() {
    return await this.prisma.planting.findMany();
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
