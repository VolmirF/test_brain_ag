import { Test } from '@nestjs/testing';
import { PropertiesController } from '../properties.controller';
import { PropertiesService } from '../properties.service';

import { mockPropertyList, mockProperty } from './mocks/mock-properties';
import { mockGetPropertiesDto } from './mocks/mock-get-properties.dto';
import { mockUpdatePropertyDto } from './mocks/mock-update-property.dto';
import { mockCreatePropertyDto } from './mocks/mock-create-property.dto';

const serviceMock = {
  getProperties: jest.fn().mockResolvedValue({
    data: mockPropertyList,
    page: 1,
    pageSize: 2,
    totalPages: 3,
    total: 5,
  }),
  getPropertyById: jest.fn().mockResolvedValue(mockProperty),
  createProperty: jest.fn().mockResolvedValue(mockProperty),
  updateProperty: jest
    .fn()
    .mockResolvedValue({ ...mockProperty, ...mockUpdatePropertyDto }),
  deleteProperty: jest.fn().mockResolvedValue(mockProperty),
};

describe('PropertiesController', () => {
  let controller: PropertiesController;
  let service: PropertiesService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [PropertiesController],
      providers: [{ provide: PropertiesService, useValue: serviceMock }],
    }).compile();

    service = moduleRef.get(PropertiesService);
    controller = moduleRef.get(PropertiesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getProperties', () => {
    it('should return paginated properties', async () => {
      const response = await controller.getProperties(mockGetPropertiesDto);

      expect(service.getProperties).toHaveBeenCalledWith(mockGetPropertiesDto);
      expect(service.getProperties).toHaveBeenCalledTimes(1);

      expect(response).toEqual({
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
      const result = await controller.getPropertyById(1);
      expect(service.getPropertyById).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockProperty);
    });
  });

  describe('createProperty', () => {
    it('should create a property', async () => {
      const result = await controller.createProperty(mockCreatePropertyDto);
      expect(service.createProperty).toHaveBeenCalledWith(
        mockCreatePropertyDto,
      );
      expect(result).toEqual(mockProperty);
    });
  });

  describe('updateProperty', () => {
    it('should update a property', async () => {
      const result = await controller.updateProperty(1, mockUpdatePropertyDto);
      expect(service.updateProperty).toHaveBeenCalledWith(
        1,
        mockUpdatePropertyDto,
      );
      expect(result).toEqual({
        ...mockProperty,
        ...mockUpdatePropertyDto,
      });
    });
  });

  describe('deleteProperty', () => {
    it('should delete a property', async () => {
      const result = await controller.deleteProperty(1);
      expect(service.deleteProperty).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockProperty);
    });
  });
});
