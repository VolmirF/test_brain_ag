/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';

import { CropsService } from '../crops.service';
import { PrismaService } from '../../../database/prisma.service';
import { PrismaClient } from '@prisma/client';

// mocks
import { mockCrops, mockCropsList } from './mocks/mock-crops';
import { mockCreateCropDto } from './mocks/mock-create-crop.dto';
import { mockUpdateCropDto } from './mocks/mock-update-crop.dto';
import { mockGetCropsDto } from './mocks/mock-get-crops.dto';

describe('CropsService', () => {
  let service: CropsService;
  let prismaMock: DeepMockProxy<PrismaClient>;

  beforeEach(async () => {
    prismaMock = mockDeep<PrismaClient>();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CropsService,
        {
          provide: PrismaService,
          useValue: prismaMock,
        },
      ],
    }).compile();

    service = module.get<CropsService>(CropsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getCrops', () => {
    it('should return paginated crops', async () => {
      prismaMock.crops.findMany.mockResolvedValue(mockCropsList);
      prismaMock.crops.count.mockResolvedValue(2);

      const result = await service.getCrops(mockGetCropsDto);

      expect(prismaMock.crops.findMany).toHaveBeenCalledWith({
        where: {
          name: { contains: mockGetCropsDto.name, mode: 'insensitive' },
        },
        skip: 0,
        take: 2,
      });
      expect(prismaMock.crops.count).toHaveBeenCalledWith({
        where: {
          name: { contains: mockGetCropsDto.name, mode: 'insensitive' },
        },
      });
      expect(result).toEqual({
        data: mockCropsList,
        page: 1,
        pageSize: 2,
        totalPages: 1,
        total: 2,
      });
    });
  });

  describe('getCropById', () => {
    it('should return a crop by id', async () => {
      prismaMock.crops.findUnique.mockResolvedValue(mockCrops);

      const result = await service.getCropById(1);

      expect(prismaMock.crops.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(result).toEqual(mockCrops);
    });
  });

  describe('createCrop', () => {
    it('should create a crop', async () => {
      prismaMock.crops.create.mockResolvedValue(mockCrops);

      const result = await service.createCrop(mockCreateCropDto);

      expect(prismaMock.crops.create).toHaveBeenCalledWith({
        data: mockCreateCropDto,
      });
      expect(result).toEqual(mockCrops);
    });
  });

  describe('updateCrop', () => {
    it('should update a crop', async () => {
      prismaMock.crops.update.mockResolvedValue({
        ...mockCrops,
        ...mockUpdateCropDto,
      });

      const result = await service.updateCrop(1, mockUpdateCropDto);

      expect(prismaMock.crops.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: mockUpdateCropDto,
      });
      expect(result).toEqual({
        ...mockCrops,
        ...mockUpdateCropDto,
      });
    });
  });

  describe('deleteCrop', () => {
    it('should delete a crop', async () => {
      prismaMock.crops.delete.mockResolvedValue(mockCrops);

      const result = await service.deleteCrop(1);

      expect(prismaMock.crops.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      });

      expect(result).toEqual(undefined);
    });
  });
});
