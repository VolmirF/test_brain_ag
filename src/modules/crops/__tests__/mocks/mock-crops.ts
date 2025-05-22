import { Crops } from '@prisma/client';

export const mockCrops: Crops = {
  id: 1,
  name: 'soja',
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const mockCropsList: Crops[] = [
  mockCrops,
  {
    id: 2,
    name: 'Milho',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];
