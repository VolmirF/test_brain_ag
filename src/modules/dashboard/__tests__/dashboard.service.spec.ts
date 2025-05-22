import { Test, TestingModule } from '@nestjs/testing';
import { DashboardService } from '../dashboard.service';
import { PrismaService } from '../../../database/prisma.service';
import { mockDashboard } from './mocks/mock-dashboard';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import { PrismaClient } from '@prisma/client';

describe('DashboardService', () => {
  let service: DashboardService;
  let prismaMock: DeepMockProxy<PrismaClient>;

  beforeEach(async () => {
    prismaMock = mockDeep<PrismaClient>();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DashboardService,
        {
          provide: PrismaService,
          useValue: prismaMock,
        },
      ],
    }).compile();

    service = module.get<DashboardService>(DashboardService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getDashboardInfo', () => {
    it('should return dashboard info', async () => {
      (prismaMock.property.aggregate as jest.Mock)
        .mockResolvedValueOnce({
          _sum: { farmArea: '1000' },
          _count: { id: 10 },
        })
        .mockResolvedValueOnce({
          _sum: { arableArea: '700', vegetationArea: '300' },
        });

      (prismaMock.property.groupBy as jest.Mock).mockResolvedValue([
        { state: 'SP', _count: { id: 5 }, _sum: { farmArea: '600' } },
        { state: 'RJ', _count: { id: 5 }, _sum: { farmArea: '400' } },
      ]);

      (prismaMock.planting.groupBy as jest.Mock).mockResolvedValue([
        { cropId: 1, _count: { cropId: 7 }, _sum: { area: '500' } },
        { cropId: 2, _count: { cropId: 3 }, _sum: { area: '200' } },
      ]);

      (prismaMock.crops.findMany as jest.Mock).mockResolvedValue([
        { id: 1, name: 'Soja' },
        { id: 2, name: 'Milho' },
      ]);

      const result = await service.getDashboardInfo();

      expect(prismaMock.property.aggregate).toHaveBeenCalledTimes(2);
      expect(prismaMock.property.groupBy).toHaveBeenCalled();
      expect(prismaMock.planting.groupBy).toHaveBeenCalled();
      expect(prismaMock.crops.findMany).toHaveBeenCalled();

      expect(result).toEqual(mockDashboard);
    });
  });
});
