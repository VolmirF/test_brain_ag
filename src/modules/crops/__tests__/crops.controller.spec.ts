import { Test, TestingModule } from '@nestjs/testing';
import { CropsController } from '../crops.controller';
import { CropsService } from '../crops.service';

// mocks
import { mockCrops, mockCropsList } from './mocks/mock-crops';
import { mockCreateCropDto } from './mocks/mock-create-crop.dto';
import { mockUpdateCropDto } from './mocks/mock-update-crop.dto';
import { mockGetCropsDto } from './mocks/mock-get-crops.dto';

const serviceMock = {
  getCrops: jest.fn().mockResolvedValue({
    data: mockCropsList,
    page: 1,
    pageSize: 2,
    totalPages: 1,
    total: 2,
  }),
  getCropById: jest.fn().mockResolvedValue(mockCrops),
  createCrop: jest.fn().mockResolvedValue(mockCrops),
  updateCrop: jest.fn().mockResolvedValue({
    ...mockCrops,
    ...mockUpdateCropDto,
  }),
  deleteCrop: jest.fn().mockResolvedValue(mockCrops),
};

describe('CropsController', () => {
  let controller: CropsController;
  let service: CropsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CropsController],
      providers: [
        {
          provide: CropsService,
          useValue: serviceMock,
        },
      ],
    }).compile();

    controller = module.get<CropsController>(CropsController);
    service = module.get<CropsService>(CropsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getCrops', () => {
    it('should return paginated crops', async () => {
      const result = await controller.getCrops(mockGetCropsDto);
      expect(service.getCrops).toHaveBeenCalledWith(mockGetCropsDto);
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
      const result = await controller.getCropById(1);
      expect(service.getCropById).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockCrops);
    });
  });

  describe('createCrop', () => {
    it('should create a crop', async () => {
      const result = await controller.createCrop(mockCreateCropDto);
      expect(service.createCrop).toHaveBeenCalledWith(mockCreateCropDto);
      expect(result).toEqual(mockCrops);
    });
  });

  describe('updateCrop', () => {
    it('should update a crop', async () => {
      const result = await controller.updateCrop(1, mockUpdateCropDto);
      expect(service.updateCrop).toHaveBeenCalledWith(1, mockUpdateCropDto);
      expect(result).toEqual({
        ...mockCrops,
        ...mockUpdateCropDto,
      });
    });
  });

  describe('deleteCrop', () => {
    it('should delete a crop', async () => {
      const result = await controller.deleteCrop(1);
      expect(service.deleteCrop).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockCrops);
    });
  });
});
