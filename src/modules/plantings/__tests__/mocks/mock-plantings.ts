import { Planting } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';

export const mockPlanting: Planting = {
  id: 1,
  propertyId: 1,
  cropId: 1,
  area: '150' as unknown as Decimal,
  year: 2024,
  yeld: null,
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const mockPlantingList: Planting[] = [
  mockPlanting,
  {
    id: 2,
    propertyId: 2,
    cropId: 2,
    area: '200' as unknown as Decimal,
    year: 2024,
    yeld: '200' as unknown as Decimal,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];
