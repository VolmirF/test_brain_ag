import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async getDashboardInfo() {
    const propertyData = await this.prisma.property.aggregate({
      _sum: { farmArea: true },
      _count: { id: true },
    });
    const byState = await this.prisma.property.groupBy({
      by: ['state'],
      _count: { id: true },
      _sum: { farmArea: true },
    });
    const byCrop = await this.prisma.planting.groupBy({
      by: ['cropId'],
      _count: { cropId: true },
      _sum: { area: true },
      where: { cropId: { not: null } },
    });
    const byLandUse = await this.prisma.property.aggregate({
      _sum: {
        arableArea: true,
        vegetationArea: true,
      },
    });

    const crops = await this.prisma.crops.findMany({
      select: { id: true, name: true },
    });
    const cropsMap: Record<number, string> = {};
    crops.forEach((crop) => {
      cropsMap[crop.id] = crop.name;
    });

    return {
      totalProperties: propertyData._count.id,
      totalArea: propertyData._sum.farmArea,
      byState: byState.map((data) => {
        return {
          state: data.state,
          propertiesCount: data._count.id,
          farmArea: data._sum.farmArea,
        };
      }),
      byCrop: byCrop.map((data) => {
        return {
          name: data.cropId ? cropsMap[data.cropId] : '',
          count: data._count.cropId,
          area: data._sum.area,
        };
      }),
      byLandUse: {
        arableArea: byLandUse._sum.arableArea,
        vegetationArea: byLandUse._sum.vegetationArea,
      },
    };
  }
}
