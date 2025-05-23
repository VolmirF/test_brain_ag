import { INestApplication, ValidationPipe } from '@nestjs/common';

// Keep config here, pipes, filters, etc, so it can be used in e2e tests
export function mainConfig(app: INestApplication) {
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
}
