/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import { mainConfig } from '../../config/main.config';

describe('ProducersController (e2e)', () => {
  let app: INestApplication;
  let producerId: number;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    mainConfig(app);
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/producers (POST) should create a producer', async () => {
    const createDto = {
      name: 'Test Producer',
      document: '495.192.710-15',
      city: 'Test City',
      state: 'SP',
    };

    const res = await request(app.getHttpServer())
      .post('/producers')
      .send(createDto)
      .expect(201);

    expect(res.body).toMatchObject({
      name: 'Test Producer',
      document: '49519271015', // Should be formatted by DTO transform
      documentType: 'CPF',
      city: 'Test City',
      state: 'SP',
    });
    expect(res.body.id).toEqual(expect.any(Number));
    expect(res.body.createdAt).toEqual(expect.any(String));
    expect(res.body.updatedAt).toEqual(expect.any(String));
    producerId = res.body.id as number;
  });

  it('/producers (GET) should return created producer', async () => {
    const res = await request(app.getHttpServer())
      .get('/producers')
      .expect(200);

    expect(res.body.data.length).toBeGreaterThan(0);
    expect(res.body.data[0]).toHaveProperty('name');
  });

  it('/producers/:id (GET) should return a producer by id', async () => {
    const res = await request(app.getHttpServer())
      .get(`/producers/${producerId}`)
      .expect(200);

    expect(res.body).toHaveProperty('id', producerId);
    expect(res.body).toHaveProperty('name', 'Test Producer');
    expect(res.body).toHaveProperty('document', '49519271015');
  });

  it('/producers/:id (PATCH) should update a producer', async () => {
    const updateDto = {
      name: 'Updated Producer',
      city: 'Updated City',
      state: 'RJ',
    };

    const res = await request(app.getHttpServer())
      .patch(`/producers/${producerId}`)
      .send(updateDto)
      .expect(200);

    expect(res.body).toMatchObject({
      id: producerId,
      name: 'Updated Producer',
      city: 'Updated City',
      state: 'RJ',
    });
  });

  it('/producers/:id (PATCH) should not allow updating to duplicate document', async () => {
    const firstProducer = await request(app.getHttpServer())
      .post('/producers')
      .send({
        name: 'First Producer',
        document: '996.039.940-06',
        city: 'City1',
        state: 'SP',
      })
      .expect(201);

    await request(app.getHttpServer()).post('/producers').send({
      name: 'Second Producer',
      document: '710.248.300-71',
      city: 'City2',
      state: 'RJ',
    });

    const updateRes = await request(app.getHttpServer())
      .patch(`/producers/${firstProducer.body.id}`)
      .send({ document: '710.248.300-71' })
      .expect(400);

    expect(updateRes.body.message).toContain(
      'Document already used by another record',
    );
  });

  it('/producers/:id (DELETE) should delete a producer', async () => {
    await request(app.getHttpServer())
      .delete(`/producers/${producerId}`)
      .expect(204);

    await request(app.getHttpServer())
      .get(`/producers/${producerId}`)
      .expect(404);
  });

  it('/producers/:id (GET) should return 404 for non-existent producer', async () => {
    await request(app.getHttpServer()).get('/producers/999999').expect(404);
  });

  it('/producers/:id (PATCH) should return 404 for non-existent producer', async () => {
    await request(app.getHttpServer())
      .patch('/producers/999999')
      .send({ name: 'No One' })
      .expect(404);
  });

  it('/producers/:id (DELETE) should return 404 for non-existent producer', async () => {
    await request(app.getHttpServer()).delete('/producers/999999').expect(404);
  });
});
