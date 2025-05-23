/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { DashboardController } from '../dashboard.controller';
import { DashboardService } from '../dashboard.service';
import { mockDashboard } from './mocks/mock-dashboard';

describe('DashboardController', () => {
  let controller: DashboardController;
  let service: DashboardService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DashboardController],
      providers: [
        {
          provide: DashboardService,
          useValue: {
            getDashboardInfo: jest.fn().mockResolvedValue(mockDashboard),
          },
        },
      ],
    }).compile();

    controller = module.get<DashboardController>(DashboardController);
    service = module.get<DashboardService>(DashboardService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getDashboardInfo', () => {
    it('should return dashboard info', async () => {
      const result = await controller.getDashboardInfo();
      expect(service.getDashboardInfo).toHaveBeenCalled();
      expect(result).toEqual(mockDashboard);
    });
  });
});
