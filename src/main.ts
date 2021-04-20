import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as config from 'config';

async function bootstrap() {
  const serverConfig = config.get('server');
  const logger = new Logger('bootstrap');
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  const port = process.env.PORT || serverConfig.port;
  await app.listen(process.env.PORT || serverConfig.port);
  logger.log(`App corriendo en puerto ${port}`)
}
bootstrap();
