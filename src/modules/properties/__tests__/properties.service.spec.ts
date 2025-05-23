/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';

import { PropertiesService } from '../properties.service';
import { PrismaService } from '../../../database/prisma.service';
import { PrismaClient } from '@prisma/client';

// mocks
import { mockProperty, mockPropertyList } from './mocks/mock-properties';
import { mockCreatePropertyDto } from './mocks/mock-create-property.dto';
import { mockUpdatePropertyDto } from './mocks/mock-update-property.dto';
import { mockGetPropertiesDto } from './mocks/mock-get-properties.dto';

describe('PropertiesService', () => {
  let service: PropertiesService;
  let prismaMock: DeepMockProxy<PrismaClient>;

  beforeEach(async () => {
    prismaMock = mockDeep<PrismaClient>();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PropertiesService,
        {
          provide: PrismaService,
          useValue: prismaMock,
        },
      ],
    }).compile();

    service = module.get<PropertiesService>(PropertiesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getProperties', () => {
    it('should return paginated properties', async () => {
      prismaMock.property.findMany.mockResolvedValue(mockPropertyList);
      prismaMock.property.count.mockResolvedValue(5);

      const result = await service.getProperties(mockGetPropertiesDto);

      expect(prismaMock.property.findMany).toHaveBeenCalledWith({
        where: {
          name: { contains: undefined, mode: 'insensitive' },
          city: undefined,
          state: undefined,
          producerId: undefined,
        },
        skip: 0,
        take: 2,
      });
      expect(prismaMock.property.count).toHaveBeenCalledWith({
        where: {
          name: { contains: undefined, mode: 'insensitive' },
          city: undefined,
          state: undefined,
          producerId: undefined,
        },
      });
      expect(result).toEqual({
        data: mockPropertyList,
        page: 1,
        pageSize: 2,
        totalPages: 3,
        total: 5,
      });
    });
  });

  describe('getPropertyById', () => {
    it('should return a property by id', async () => {
      prismaMock.property.findUnique.mockResolvedValue(mockProperty);

      const result = await service.getPropertyById(1);

      expect(prismaMock.property.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(result).toEqual(mockProperty);
    });
  });

  describe('createProperty', () => {
    it('should create a property', async () => {
      prismaMock.property.create.mockResolvedValue(mockProperty);

      const result = await service.createProperty(mockCreatePropertyDto);

      expect(prismaMock.property.create).toHaveBeenCalledWith({
        data: mockCreatePropertyDto,
      });
      expect(result).toEqual(mockProperty);
    });
  });

  describe('updateProperty', () => {
    it('should update a property', async () => {
      // @ts-expect-error Decimal is converted to string, this is not a problem and works fine with prisma
      prismaMock.property.update.mockResolvedValue({
        ...mockProperty,
        ...mockUpdatePropertyDto,
      });
      prismaMock.property.findFirst.mockResolvedValue(mockProperty);

      const result = await service.updateProperty(1, mockUpdatePropertyDto);

      expect(prismaMock.property.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: mockUpdatePropertyDto,
      });
      expect(result).toEqual({
        ...mockProperty,
        ...mockUpdatePropertyDto,
      });
    });

    it('should throw error, invalid property area', (done) => {
      prismaMock.property.findFirst.mockResolvedValue(mockProperty);
      service
        .updateProperty(1, {
          ...mockUpdatePropertyDto,
          farmArea: '0',
        })
        .then(() => {
          done.fail('Error should be thrown, invalid property area');
          return undefined;
        })
        .catch((error: Error) => {
          expect(error.message).toBe(
            'The sum of arableArea, farmArea and vegetationArea must be greater than farmArea.',
          );
          done();
        });
    });
  });

  describe('deleteProperty', () => {
    it('should delete a property', async () => {
      prismaMock.property.delete.mockResolvedValue(mockProperty);

      const result = await service.deleteProperty(1);

      expect(prismaMock.property.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(result).toEqual(undefined);
    });
  });
});
