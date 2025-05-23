/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../../src/app.module';
import { mainConfig } from '../../config/main.config';

describe('CropsController (e2e)', () => {
  let app: INestApplication<App>;
  let cropId: number;

  beforeEach(async () => {
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

  it('/crops (POST) should create a crop', async () => {
    const createDto = { name: 'Soja' };
    const response = await request(app.getHttpServer())
      .post('/crops')
      .send(createDto)
      .expect(201);

    expect(response.body).toEqual(expect.any(Object));

    expect((response.body as object)['id']).toEqual(expect.any(Number));
    expect((response.body as object)['name']).toEqual('Soja');
    expect((response.body as object)['createdAt']).toEqual(expect.any(String));
    expect((response.body as object)['updatedAt']).toEqual(expect.any(String));
    cropId = response.body.id as number;
  });

  it('/crops (GET) should return created crop', async () => {
    const response = await request(app.getHttpServer())
      .get('/crops')
      .expect(200);

    expect(response.body).toEqual(expect.any(Object));

    expect(response.body?.data?.length).toBeGreaterThan(0);
    expect(response.body?.data[0]).toHaveProperty('name', 'Soja');
  });

  it('/crops/:id (GET) should return 404', async () => {
    await request(app.getHttpServer()).get('/crops/10000').expect(404);
  });

  it('/crops/:id (GET) should return a crop by id', async () => {
    const getRes = await request(app.getHttpServer())
      .get(`/crops/${cropId}`)
      .expect(200);

    expect(getRes.body).toMatchObject({
      id: cropId,
      name: 'Soja',
    });
  });

  it('/crops/:id (PATCH) should update a crop', async () => {
    const updateRes = await request(app.getHttpServer())
      .patch(`/crops/${cropId}`)
      .send({ name: 'Crop Updated' })
      .expect(200);

    expect(updateRes.body).toMatchObject({
      id: cropId,
      name: 'Crop Updated',
    });
  });

  it('/crops/:id (DELETE) should delete a crop', async () => {
    // Delete the crop
    await request(app.getHttpServer()).delete(`/crops/${cropId}`).expect(204);

    // Ensure it's deleted
    await request(app.getHttpServer()).get(`/crops/${cropId}`).expect(404);
  });
});
