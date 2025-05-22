/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';

import { PlantingsService } from '../plantings.service';
import { PrismaService } from '../../../database/prisma.service';
import { PrismaClient } from '@prisma/client';

// mocks
import { mockPlanting, mockPlantingList } from './mocks/mock-plantings';
import { mockCreatePlantingDto } from './mocks/mock-create-planting.dto';
import { mockUpdatePlantingDto } from './mocks/mock-update-planting.dto';
import { mockGetPlantingsDto } from './mocks/mock-get-plantings.dto';

describe('PlantingsService', () => {
  let service: PlantingsService;
  let prismaMock: DeepMockProxy<PrismaClient>;

  beforeEach(async () => {
    prismaMock = mockDeep<PrismaClient>();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PlantingsService,
        {
          provide: PrismaService,
          useValue: prismaMock,
        },
      ],
    }).compile();

    service = module.get<PlantingsService>(PlantingsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getPlantings', () => {
    it('should return paginated plantings', async () => {
      prismaMock.planting.findMany.mockResolvedValue(mockPlantingList);
      prismaMock.planting.count.mockResolvedValue(2);

      const result = await service.getPlantings(mockGetPlantingsDto);

      expect(prismaMock.planting.findMany).toHaveBeenCalledWith({
        where: {
          propertyId: mockGetPlantingsDto.propertyId,
          year: mockGetPlantingsDto.year,
        },
        skip: 0,
        take: 2,
      });
      expect(prismaMock.planting.count).toHaveBeenCalledWith({
        where: {
          propertyId: mockGetPlantingsDto.propertyId,
          year: mockGetPlantingsDto.year,
        },
      });
      expect(result).toEqual({
        data: mockPlantingList,
        page: 1,
        pageSize: 2,
        totalPages: 1,
        total: 2,
      });
    });
  });

  describe('getPlantingById', () => {
    it('should return a planting by id', async () => {
      prismaMock.planting.findUnique.mockResolvedValue(mockPlanting);

      const result = await service.getPlantingById(1);

      expect(prismaMock.planting.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(result).toEqual(mockPlanting);
    });
  });

  describe('createPlanting', () => {
    it('should create a planting', async () => {
      prismaMock.planting.create.mockResolvedValue(mockPlanting);

      const result = await service.createPlanting(mockCreatePlantingDto);

      expect(prismaMock.planting.create).toHaveBeenCalledWith({
        data: mockCreatePlantingDto,
      });
      expect(result).toEqual(mockPlanting);
    });
  });

  describe('updatePlanting', () => {
    it('should update a planting', async () => {
      // @ts-expect-error Decimal is converted to string, this is not a problem and works fine with prisma
      prismaMock.planting.update.mockResolvedValue({
        ...mockPlanting,
        ...mockUpdatePlantingDto,
      });

      const result = await service.updatePlanting(1, mockUpdatePlantingDto);

      expect(prismaMock.planting.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: mockUpdatePlantingDto,
      });
      expect(result).toEqual({
        ...mockPlanting,
        ...mockUpdatePlantingDto,
      });
    });
  });

  describe('deletePlanting', () => {
    it('should delete a planting', async () => {
      prismaMock.planting.delete.mockResolvedValue(mockPlanting);

      const result = await service.deletePlanting(1);

      expect(prismaMock.planting.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(result).toEqual(mockPlanting);
    });
  });
});
