import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { mainConfig } from '../config/main.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Set up swagger docs
  const config = new DocumentBuilder()
    .setTitle('Agriculture management API brain.ag')
    .setDescription('Api for agriculture management.')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(`api`, app, document);

  mainConfig(app);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
