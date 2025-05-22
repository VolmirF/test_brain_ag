import { Test, TestingModule } from '@nestjs/testing';
import { ProducersController } from '../producers.controller';
import { ProducersService } from '../producers.service';

// mocks
import { mockProducer, mockProducerList } from './mocks/mock-producer';
import { mockCreateProducerDto } from './mocks/mock-create-producer.dto';
import { mockUpdateProducerDto } from './mocks/mock-update-producer.dto';
import { mockGetProducersDtoPaginated } from './mocks/mock-get-producers.dto';

const serviceMock = {
  getProducers: jest.fn().mockResolvedValue({
    data: mockProducerList,
    page: 1,
    pageSize: 2,
    totalPages: 1,
    total: 2,
  }),
  getProducerById: jest.fn().mockResolvedValue(mockProducer),
  createProducer: jest.fn().mockResolvedValue(mockProducer),
  updateProducer: jest.fn().mockResolvedValue({
    ...mockProducer,
    ...mockUpdateProducerDto,
  }),
  deleteProducer: jest.fn().mockResolvedValue(mockProducer),
};

describe('ProducersController', () => {
  let controller: ProducersController;
  let service: ProducersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProducersController],
      providers: [
        {
          provide: ProducersService,
          useValue: serviceMock,
        },
      ],
    }).compile();

    controller = module.get<ProducersController>(ProducersController);
    service = module.get<ProducersService>(ProducersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getProducers', () => {
    it('should return paginated producers', async () => {
      const result = await controller.getProducers(
        mockGetProducersDtoPaginated,
      );
      expect(service.getProducers).toHaveBeenCalledWith(
        mockGetProducersDtoPaginated,
      );
      expect(result).toEqual({
        data: mockProducerList,
        page: 1,
        pageSize: 2,
        totalPages: 1,
        total: 2,
      });
    });
  });

  describe('getProducerById', () => {
    it('should return a producer by id', async () => {
      const result = await controller.getProducerById(1);
      expect(service.getProducerById).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockProducer);
    });
  });

  describe('createProducer', () => {
    it('should create a producer', async () => {
      const result = await controller.createProducer(mockCreateProducerDto);
      expect(service.createProducer).toHaveBeenCalledWith(
        mockCreateProducerDto,
      );
      expect(result).toEqual(mockProducer);
    });
  });

  describe('updateProducer', () => {
    it('should update a producer', async () => {
      const result = await controller.updateProducer(1, mockUpdateProducerDto);
      expect(service.updateProducer).toHaveBeenCalledWith(
        1,
        mockUpdateProducerDto,
      );
      expect(result).toEqual({
        ...mockProducer,
        ...mockUpdateProducerDto,
      });
    });
  });

  describe('deleteProducer', () => {
    it('should delete a producer', async () => {
      const result = await controller.deleteProducer(1);
      expect(service.deleteProducer).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockProducer);
    });
  });
});
