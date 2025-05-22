import { Property } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';

export const mockProperty: Property = {
  id: 1,
  name: 'Property 1',
  city: 'CityX',
  state: 'SP',
  producerId: 1,
  farmArea: '300' as unknown as Decimal,
  arableArea: '200' as unknown as Decimal,
  vegetationArea: '100' as unknown as Decimal,
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const mockPropertyList: Property[] = [
  mockProperty,
  {
    id: 2,
    name: 'Property 2',
    city: 'CityY',
    state: 'RJ',
    producerId: 2,
    farmArea: '600' as unknown as Decimal,
    arableArea: '400' as unknown as Decimal,
    vegetationArea: '200' as unknown as Decimal,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];
