import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

import { CreatePropertyDto } from './dtos/create-property.dto';
import { UpdatePropertyDto } from './dtos/update-property.dto';
import { GetPropertiesDto } from './dtos/get-properties.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class PropertiesService {
  constructor(private readonly prisma: PrismaService) {}

  private readonly logger = new Logger(PropertiesService.name);

  async getProperties(params: GetPropertiesDto) {
    try {
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
    } catch (error) {
      this.logger.error('Error fetching properties: ', error);
      throw error;
    }
  }

  async getPropertyById(id: number) {
    try {
      const property = await this.prisma.property.findUnique({
        where: { id },
      });
      if (!property) throw new NotFoundException('Property not found');
      return property;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      this.logger.error('Error fetching property by ID: ', error);
      throw error;
    }
  }

  async createProperty(data: CreatePropertyDto) {
    try {
      const producer = await this.prisma.producer.findFirst({
        where: { id: data.producerId },
      });
      if (producer === null)
        throw new BadRequestException('Producer not found');

      return await this.prisma.property.create({
        data,
      });
    } catch (error) {
      if (error instanceof BadRequestException) throw error;
      this.logger.error('Error creating property: ', error);
      throw error;
    }
  }

  async updateProperty(id: number, data: UpdatePropertyDto) {
    try {
      if (data.producerId) {
        const producer = await this.prisma.producer.findFirst({
          where: { id: data.producerId },
        });
        if (producer === null)
          throw new BadRequestException('Property not found');
      }

      if (!(await this.propertyAreaIsValid(data, id))) {
        throw new BadRequestException(
          'The sum of arableArea, farmArea and vegetationArea must be greater than farmArea.',
        );
      }

      return await this.prisma.property.update({
        where: { id },
        data,
      });
    } catch (error) {
      if (error instanceof BadRequestException) throw error;
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error?.code === 'P2025'
      ) {
        throw new NotFoundException('Property not found');
      }
      this.logger.error('Error updating property: ', error);
      throw error;
    }
  }

  async deleteProperty(id: number) {
    try {
      await this.prisma.property.delete({
        where: { id },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error?.code === 'P2025'
      ) {
        throw new NotFoundException('Property not found');
      }
      this.logger.error('Error deleting property: ', error);
      throw error;
    }
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
        this.logger.error('Property area is invalid in db. Property id: ', id);
        return false;
      }
      return (
        Number(areas.farmArea) >=
        Number(areas.arableArea) + Number(areas.vegetationArea)
      );
    }
    // Area is not been updated, no need to check
    return true;
  }
}
