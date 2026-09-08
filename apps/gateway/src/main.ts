import fastifyHttpProxy from '@fastify/http-proxy';
import { Logger, ValidationPipe, VersioningType } from '@nestjs/common';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import {
  authEnvConfig,
  authServiceFallbackSpec,
  getCorsConfig,
  getDocsConfig,
  getValidationConfig,
  httpEnvConfig,
} from '@repo/common/configs';
import {
  AUTH_API_PREFIX,
  METADATA,
  SERVICE_KEYS,
} from '@repo/common/constants';
import { HttpExceptionFilter } from '@repo/common/filters';
import { LoggingInterceptor } from '@repo/common/interceptors';
import { ContextService } from '@repo/infrastructure/context';
import { FastifyReply, FastifyRequest } from 'fastify';

import { CorrelationIdPlugin } from '@/core/plugins';

import { AppModule } from './app.module';

async function bootstrap() {
  const adapter = new FastifyAdapter({});

  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    adapter,
  );

  const fastifyInstance = adapter.getInstance();

  const jwtService = app.get(JwtService);
  const contextService = app.get(ContextService);
  const httpAdapterHost = app.get(HttpAdapterHost);

  const logger = new Logger('API Gateway');

  const authServiceUrl = authEnvConfig().betterAuth.authServiceUrl;

  await fastifyInstance.register(fastifyHttpProxy as any, {
    upstream: authServiceUrl,
    prefix: AUTH_API_PREFIX,
    rewritePrefix: AUTH_API_PREFIX,
    http2: false,
    logLevel: 'info',
    preHandler: async (request: FastifyRequest) => {
      const correlationId =
        (request.headers[METADATA.CORRELATION_ID] as string) ||
        contextService.getCorrelationId?.() ||
        request.id;

      const token = await jwtService.signAsync({ cid: correlationId });

      request.headers[METADATA.INTERNAL_TOKEN] = token;
      request.headers[METADATA.CORRELATION_ID] = correlationId;
      (request.raw as any)._internalToken = token;
      (request.raw as any)._correlationId = correlationId;
    },
    replyOptions: {
      rewriteHeaders: (headers: Record<string, any>) => {
        headers[METADATA.SERVICE_NAME] = SERVICE_KEYS.AUTH;
        return headers;
      },
      rewriteRequestHeaders: (
        originalReq: FastifyRequest | any,
        headers: Record<string, any>,
      ) => {
        const targetUrl = `${authServiceUrl}${originalReq.url}`;

        logger.log(
          `🚀 [PROXY OUT] ${originalReq.method} ${originalReq.url} -> ${targetUrl} (ReqID: ${originalReq.id})`,
        );

        const internalToken =
          originalReq.headers?.[METADATA.INTERNAL_TOKEN] ||
          (originalReq.raw as any)?._internalToken;

        const correlationId =
          originalReq.headers?.[METADATA.CORRELATION_ID] ||
          (originalReq.raw as any)?._correlationId ||
          originalReq.id;

        headers[METADATA.INTERNAL_TOKEN] = internalToken;
        headers[METADATA.CORRELATION_ID] = correlationId;
        headers[METADATA.HOST] = new URL(authServiceUrl).host;
        headers[METADATA.REQUEST_ID] = originalReq.id;

        return headers;
      },
      getUpstream: () => authServiceUrl,
    },
    proxyPayloads: true,
  });

  await app.register(() =>
    CorrelationIdPlugin(fastifyInstance as any, contextService),
  );

  // app.useBodyParser('json');
  app.setGlobalPrefix('api');
  app.useGlobalFilters(new HttpExceptionFilter(httpAdapterHost));
  app.useGlobalPipes(new ValidationPipe(getValidationConfig()));
  app.useGlobalInterceptors(new LoggingInterceptor());
  app.enableCors(getCorsConfig(httpEnvConfig()));

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  await getDocsConfig(app, [
    {
      name: 'Auth Service',
      url: `${authServiceUrl}/api/v12/docs/openapi.json`,
      fallbackSpec: authServiceFallbackSpec,
    },
  ]);

  const port = httpEnvConfig().http.port;
  const host = httpEnvConfig().http.host;

  await app.listen(port, '0.0.0.0');

  logger.log(`\x1b[42mAPI Gateway started at: ${host}/api/v1\x1b[0m`);
  logger.log(`\x1b[43mAuth Proxy configured -> ${authServiceUrl}\x1b[0m`);
  logger.log(`\x1b[47mSwagger: ${host}/docs/swagger\x1b[0m`);
  logger.log(`\x1b[47mScalar: ${host}/docs/scalar\x1b[0m`);
}

bootstrap().catch(err => {
  new Logger('Bootstrap').error(err);
  process.exit(1);
});
