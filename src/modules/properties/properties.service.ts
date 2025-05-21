import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { CreatePropertyDto } from './dtos/create-property.dto';
import { UpdatePropertyDto } from './dtos/update-property.dto';

@Injectable()
export class PropertiesService {
  constructor(private readonly prisma: PrismaService) {}

  async getProperties() {
    return await this.prisma.property.findMany({});
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
      return areas.farmArea >= areas.arableArea + areas.vegetationArea;
    }
  }
}
