import { Test, TestingModule } from '@nestjs/testing';
import { PlantingsController } from '../plantings.controller';
import { PlantingsService } from '../plantings.service';

// mocks
import { mockPlanting, mockPlantingList } from './mocks/mock-plantings';
import { mockCreatePlantingDto } from './mocks/mock-create-planting.dto';
import { mockUpdatePlantingDto } from './mocks/mock-update-planting.dto';
import { mockGetPlantingsDto } from './mocks/mock-get-plantings.dto';

const serviceMock = {
  getPlantings: jest.fn().mockResolvedValue({
    data: mockPlantingList,
    page: 1,
    pageSize: 2,
    totalPages: 1,
    total: 2,
  }),
  getPlantingById: jest.fn().mockResolvedValue(mockPlanting),
  createPlanting: jest.fn().mockResolvedValue(mockPlanting),
  updatePlanting: jest.fn().mockResolvedValue({
    ...mockPlanting,
    ...mockUpdatePlantingDto,
  }),
  deletePlanting: jest.fn().mockResolvedValue(mockPlanting),
};

describe('PlantingsController', () => {
  let controller: PlantingsController;
  let service: PlantingsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PlantingsController],
      providers: [
        {
          provide: PlantingsService,
          useValue: serviceMock,
        },
      ],
    }).compile();

    controller = module.get<PlantingsController>(PlantingsController);
    service = module.get<PlantingsService>(PlantingsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getPlantings', () => {
    it('should return paginated plantings', async () => {
      const result = await controller.getPlantings(mockGetPlantingsDto);
      expect(service.getPlantings).toHaveBeenCalledWith(mockGetPlantingsDto);
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
      const result = await controller.getPlantingById(1);
      expect(service.getPlantingById).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockPlanting);
    });
  });

  describe('createPlanting', () => {
    it('should create a planting', async () => {
      const result = await controller.createPlanting(mockCreatePlantingDto);
      expect(service.createPlanting).toHaveBeenCalledWith(
        mockCreatePlantingDto,
      );
      expect(result).toEqual(mockPlanting);
    });
  });

  describe('updatePlanting', () => {
    it('should update a planting', async () => {
      const result = await controller.updatePlanting(1, mockUpdatePlantingDto);
      expect(service.updatePlanting).toHaveBeenCalledWith(
        1,
        mockUpdatePlantingDto,
      );
      expect(result).toEqual({
        ...mockPlanting,
        ...mockUpdatePlantingDto,
      });
    });
  });

  describe('deletePlanting', () => {
    it('should delete a planting', async () => {
      const result = await controller.deletePlanting(1);
      expect(service.deletePlanting).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockPlanting);
    });
  });
});
