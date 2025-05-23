/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import { mainConfig } from '../../config/main.config';

describe('PropertiesController (e2e)', () => {
  let app: INestApplication;
  let propertyId: number;
  let producerId: number;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    mainConfig(app);
    await app.init();

    const producerRes = await request(app.getHttpServer())
      .post('/producers')
      .send({
        name: 'Test Producer',
        document: '965.679.100-20',
        documentType: 'CPF',
        city: 'Test City',
        state: 'SP',
      })
      .expect(201);

    producerId = producerRes.body.id as number;
  });

  afterAll(async () => {
    await app.close();
  });

  it('/properties (POST) should fail if producer does not exist', async () => {
    const createDto = {
      name: 'Test Property',
      city: 'Test City',
      state: 'SP',
      farmArea: '100',
      arableArea: '60',
      vegetationArea: '40',
      producerId: 99999, // non-existent
    };
    const res = await request(app.getHttpServer())
      .post('/properties')
      .send(createDto)
      .expect(400);

    expect(res.body.message).toBe('Producer not found');
  });

  it('/properties (POST) should create a property', async () => {
    const createDto = {
      name: 'Test Property',
      city: 'Test City',
      state: 'SP',
      farmArea: '100',
      arableArea: '60',
      vegetationArea: '40',
      producerId,
    };

    const res = await request(app.getHttpServer())
      .post('/properties')
      .send(createDto)
      .expect(201);

    expect(res.body).toMatchObject({
      name: 'Test Property',
      city: 'Test City',
      state: 'SP',
      farmArea: '100',
      arableArea: '60',
      vegetationArea: '40',
      producerId,
    });
    expect(res.body.id).toEqual(expect.any(Number));
    expect(res.body.createdAt).toEqual(expect.any(String));
    expect(res.body.updatedAt).toEqual(expect.any(String));
    propertyId = res.body.id as number;
  });

  it('/properties (GET) should return created property', async () => {
    const res = await request(app.getHttpServer())
      .get('/properties')
      .expect(200);

    expect(res.body.data.length).toBeGreaterThan(0);
    expect(res.body.data[0]).toHaveProperty('name');
  });

  it('/properties/:id (GET) should return a property by id', async () => {
    const res = await request(app.getHttpServer())
      .get(`/properties/${propertyId}`)
      .expect(200);

    expect(res.body).toHaveProperty('id', propertyId);
    expect(res.body).toHaveProperty('name', 'Test Property');
  });

  it('/properties/:id (PATCH) should update a property', async () => {
    const updateDto = {
      name: 'Updated Property',
      farmArea: '120',
      arableArea: '80',
      vegetationArea: '40',
    };

    const res = await request(app.getHttpServer())
      .patch(`/properties/${propertyId}`)
      .send(updateDto);
    expect(res.status).toBe(200);

    expect(res.body).toMatchObject({
      id: propertyId,
      name: 'Updated Property',
      farmArea: '120',
      arableArea: '80',
      vegetationArea: '40',
    });
  });

  it('/properties/:id (DELETE) should delete a property', async () => {
    await request(app.getHttpServer())
      .delete(`/properties/${propertyId}`)
      .expect(204);

    // Ensure it's deleted
    await request(app.getHttpServer())
      .get(`/properties/${propertyId}`)
      .expect(404);
  });
});
