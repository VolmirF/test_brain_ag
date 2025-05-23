/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import { mainConfig } from '../../config/main.config';

describe('PlantingsController (e2e)', () => {
  let app: INestApplication;
  let propertyId: number;
  let cropId: number;

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
        document: '558.178.550-38',
        documentType: 'CPF',
        city: 'Test City',
        state: 'SP',
      })
      .expect(201);

    const producerId = producerRes.body.id;

    const propertyRes = await request(app.getHttpServer())
      .post('/properties')
      .send({
        name: 'Test Property',
        city: 'Test City',
        state: 'SP',
        farmArea: '100',
        arableArea: '60',
        vegetationArea: '40',
        producerId,
      })
      .expect(201);

    propertyId = propertyRes.body.id;

    const cropRes = await request(app.getHttpServer())
      .post('/crops')
      .send({ name: 'Soja' })
      .expect(201);

    cropId = cropRes.body.id;
  });

  afterAll(async () => {
    await app.close();
  });

  it('/plantings (POST) should fail if property does not exist', async () => {
    const createDto = {
      propertyId: 99999,
      cropId,
      area: '10',
      year: 2024,
    };
    const res = await request(app.getHttpServer())
      .post('/plantings')
      .send(createDto)
      .expect(400);

    expect(res.body.message).toBe('Property not found');
  });

  it('/plantings (POST) should fail if crop does not exist', async () => {
    const createDto = {
      propertyId,
      cropId: 99999,
      area: '10',
      year: 2024,
    };
    const res = await request(app.getHttpServer())
      .post('/plantings')
      .send(createDto)
      .expect(400);

    expect(res.body.message).toBe('Crop not found');
  });

  it('/plantings (POST) should create a planting', async () => {
    const createDto = {
      propertyId,
      cropId,
      area: '10',
      year: 2024,
    };
    const res = await request(app.getHttpServer())
      .post('/plantings')
      .send(createDto);

    expect(res.body).toMatchObject({
      propertyId,
      cropId,
      area: '10',
      year: 2024,
    });
    expect(res.status).toBe(201);
    expect(res.body.id).toEqual(expect.any(Number));
  });

  it('/plantings (GET) should return created planting', async () => {
    const res = await request(app.getHttpServer())
      .get('/plantings')
      .query({ page: 1, pageSize: 10 })
      .expect(200);

    expect(res.body.data.length).toBeGreaterThan(0);
    expect(res.body.data[0]).toHaveProperty('propertyId', propertyId);
    expect(res.body.data[0]).toHaveProperty('cropId', cropId);
  });

  it('/plantings/:id (GET) should return a planting by id', async () => {
    // Get the planting id
    const listRes = await request(app.getHttpServer())
      .get('/plantings')
      .query({ page: 1, pageSize: 10 })
      .expect(200);

    expect(listRes.body.data.length).toBeGreaterThan(0);
    const plantingId = listRes.body.data[0].id;

    const res = await request(app.getHttpServer())
      .get(`/plantings/${plantingId}`)
      .expect(200);

    expect(res.body).toHaveProperty('id', plantingId);
    expect(res.body).toHaveProperty('propertyId', propertyId);
    expect(res.body).toHaveProperty('cropId', cropId);
  });

  it('/plantings/:id (PATCH) should update a planting', async () => {
    // Get the planting id
    const listRes = await request(app.getHttpServer())
      .get('/plantings')
      .query({ page: 1, pageSize: 10 })
      .expect(200);

    const plantingId = listRes.body.data[0].id;

    const updateDto = {
      area: '20',
      year: 2025,
    };

    const res = await request(app.getHttpServer())
      .patch(`/plantings/${plantingId}`)
      .send(updateDto)
      .expect(200);

    expect(res.body).toMatchObject({
      id: plantingId,
      area: '20',
      year: 2025,
    });
  });

  it('/plantings/:id (DELETE) should delete a planting', async () => {
    // Create a new planting to delete
    const createRes = await request(app.getHttpServer())
      .post('/plantings')
      .send({
        propertyId,
        cropId,
        area: '30',
        year: 2026,
      })
      .expect(201);

    const plantingId = createRes.body.id;

    await request(app.getHttpServer())
      .delete(`/plantings/${plantingId}`)
      .expect(204);

    // Ensure it's deleted
    await request(app.getHttpServer())
      .get(`/plantings/${plantingId}`)
      .expect(404);
  });
});
