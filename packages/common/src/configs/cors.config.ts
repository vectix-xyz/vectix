import type { FastifyCorsOptions } from '@fastify/cors';
import type { ConfigType } from '@nestjs/config';

import { httpEnvConfig } from './env';

/**
 * Generates CORS configuration for applications using the Fastify engine.
 * * @description
 * This configuration is specifically typed for the `@fastify/cors` plugin used
 * by the `FastifyAdapter`. It addresses strict type differences in the `origin`
 * property (AsyncOriginFunction) where Fastify expects a specific signature
 * compared to Express.
 *
 * @param {ConfigService} configService - NestJS configuration service to retrieve 'HTTP_CORS' environment variable.
 * @returns {FastifyCorsOptions} A configuration object specifically for the Fastify adapter.
 * * @example
 * // In main.ts:
 * app.enableCors(getCorsConfig(configService));
 */
export function getCorsConfig(
  env: ConfigType<typeof httpEnvConfig>,
): FastifyCorsOptions {
  return {
    origin: env.http.cors,
    credentials: true,
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ['Set-Cookie'],
  };
}
