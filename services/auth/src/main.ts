// auth-service/src/main.ts

import { Logger, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { httpEnvConfig } from '@repo/common/configs';
import { LoggingPlugin } from '@repo/common/plugins';
import { useContainer } from 'class-validator';

import { AppModule } from './app.module';

async function bootstrap() {
  const adapter = new FastifyAdapter();

  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    adapter,
    {
      bodyParser: false,
    },
  );

  const fastifyInstance = adapter.getInstance();

  const logger = new Logger('Auth Service');

  await app.register(() => LoggingPlugin(fastifyInstance as any));

  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  app.setGlobalPrefix('api');

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  const port = httpEnvConfig().http.port;
  const host = httpEnvConfig().http.host;

  await app.listen(port, '0.0.0.0');

  logger.log(`\x1b[42mAuth Service started at: ${host}/api/v1/auth\x1b[0m`);
}

bootstrap().catch(err => {
  new Logger('Bootstrap').error(err);
  process.exit(1);
});
