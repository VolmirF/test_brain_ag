/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';

import { ProducersService } from '../producers.service';
import { PrismaService } from '../../../database/prisma.service';
import { PrismaClient } from '@prisma/client';

// mocks
import { mockProducer, mockProducerList } from './mocks/mock-producer';
import { mockCreateProducerDto } from './mocks/mock-create-producer.dto';
import { mockUpdateProducerDto } from './mocks/mock-update-producer.dto';
import { mockGetProducersDtoPaginated } from './mocks/mock-get-producers.dto';

describe('ProducersService', () => {
  let service: ProducersService;
  let prismaMock: DeepMockProxy<PrismaClient>;

  beforeEach(async () => {
    prismaMock = mockDeep<PrismaClient>();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProducersService,
        {
          provide: PrismaService,
          useValue: prismaMock,
        },
      ],
    }).compile();

    service = module.get<ProducersService>(ProducersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getProducers', () => {
    it('should return paginated producers', async () => {
      prismaMock.producer.findMany.mockResolvedValue(mockProducerList);
      prismaMock.producer.count.mockResolvedValue(5);

      const result = await service.getProducers(mockGetProducersDtoPaginated);

      expect(prismaMock.producer.findMany).toHaveBeenCalledWith({
        where: {
          name: { contains: undefined, mode: 'insensitive' },
          document: undefined,
          documentType: undefined,
          state: undefined,
        },
        skip: 0,
        take: 2,
      });
      expect(prismaMock.producer.count).toHaveBeenCalledWith({
        where: {
          name: { contains: undefined, mode: 'insensitive' },
          document: undefined,
          documentType: undefined,
          state: undefined,
        },
      });
      expect(result).toEqual({
        data: mockProducerList,
        page: 1,
        pageSize: 2,
        totalPages: 3,
        total: 5,
      });
    });
  });

  describe('getProducerById', () => {
    it('should return a producer by id', async () => {
      prismaMock.producer.findUnique.mockResolvedValue(mockProducer);

      const result = await service.getProducerById(1);

      expect(prismaMock.producer.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(result).toEqual(mockProducer);
    });
  });

  describe('createProducer', () => {
    it('should create a producer', async () => {
      prismaMock.producer.create.mockResolvedValue(mockProducer);

      const result = await service.createProducer(mockCreateProducerDto);

      expect(prismaMock.producer.create).toHaveBeenCalledWith({
        data: {
          name: 'A',
          document: '123',
          city: 'X',
          state: 'SP',
          documentType: 'CPF',
        },
      });
      expect(result).toEqual(mockProducer);
    });
  });

  describe('updateProducer', () => {
    it('should update a producer', async () => {
      prismaMock.producer.update.mockResolvedValue({
        ...mockProducer,
        ...mockUpdateProducerDto,
      });

      const result = await service.updateProducer(1, mockUpdateProducerDto);

      expect(prismaMock.producer.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { ...mockUpdateProducerDto },
      });
      expect(result).toEqual({ ...mockProducer, ...mockUpdateProducerDto });
    });
  });

  describe('deleteProducer', () => {
    it('should delete a producer', async () => {
      prismaMock.producer.delete.mockResolvedValue(mockProducer);

      const result = await service.deleteProducer(1);

      expect(prismaMock.producer.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(result).toEqual(mockProducer);
    });
  });
});
