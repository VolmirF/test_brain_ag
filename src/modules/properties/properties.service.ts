import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

import { CreatePropertyDto } from './dtos/create-property.dto';
import { UpdatePropertyDto } from './dtos/update-property.dto';
import { GetPropertiesDto } from './dtos/get-properties.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class PropertiesService {
  constructor(private readonly prisma: PrismaService) {}

  async getProperties(params: GetPropertiesDto) {
    const whereQuery: Prisma.PropertyFindManyArgs['where'] = {
      state: params.state,
      name: { contains: params.name, mode: 'insensitive' },
      producerId: params.producerId,
    };

    const properties = await this.prisma.property.findMany({
      where: whereQuery,
      skip: (params.page - 1) * params.pageSize,
      take: params.pageSize,
    });
    const countProperties = await this.prisma.property.count({
      where: whereQuery,
    });

    return {
      data: properties,
      page: params.page,
      pageSize: params.pageSize,
      totalPages: Math.ceil(countProperties / params.pageSize),
      total: countProperties,
    };
  }

  async getPropertyById(id: number) {
    return await this.prisma.property.findUnique({
      where: { id },
    });
  }

  async createProperty(data: CreatePropertyDto) {
    return await this.prisma.property.create({
      data,
    });
  }

  async updateProperty(id: number, data: UpdatePropertyDto) {
    if (!(await this.propertyAreaIsValid(data, id))) {
      throw new BadRequestException(
        'The sum of arableArea, farmArea and vegetationArea must be greater than farmArea.',
      );
    }

    return await this.prisma.property.update({
      where: { id },
      data,
    });
  }

  async deleteProperty(id: number) {
    return await this.prisma.property.delete({
      where: { id },
    });
  }

  private async propertyAreaIsValid(data: UpdatePropertyDto, id?: number) {
    const areaKeys = ['arableArea', 'farmArea', 'vegetationArea'];

    if (areaKeys.some((areaKey) => data[areaKey] !== undefined)) {
      const areas = {
        arableArea: data.arableArea,
        farmArea: data.farmArea,
        vegetationArea: data.vegetationArea,
      };
      if (areaKeys.some((areaKey) => data[areaKey] === undefined)) {
        if (!id) return false;
        const property = await this.prisma.property.findFirst({
          where: { id },
        });
        if (property === null) return false;
        areaKeys.forEach((areaKey) => {
          areas[areaKey] ??= Number(property[areaKey]);
        });
      }
      if (
        areas.farmArea === undefined ||
        areas.arableArea === undefined ||
        areas.vegetationArea === undefined
      ) {
        // Problem with the register in db
        return false;
      }
      return areas.farmArea >= areas.arableArea + areas.vegetationArea;
    }
    // Area is not been updated, no need to check
    return true;
  }
}
