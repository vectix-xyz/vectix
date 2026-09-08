import { INestApplication, Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { MESSAGES } from '@repo/common/constants';
import { apiReference } from '@scalar/nestjs-api-reference';
import merge from 'lodash.merge';

export interface ExternalOpenAPISource {
  /** Human-readable name, e.g. "Auth Service" */
  name: string;
  /** Runtime URL to fetch OpenAPI JSON from, e.g. http://localhost:4201/api/v1/auth/reference/openapi.json */
  url: string;
  /** Static fallback OpenAPI spec object used when the service is unreachable */
  fallbackSpec: Record<string, any>;
}

async function fetchExternalSpec(
  source: ExternalOpenAPISource,
  logger: Logger,
): Promise<Record<string, any> | null> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3000);

    const response = await fetch(source.url, {
      signal: controller.signal,
      headers: { Accept: 'application/json' },
    });

    clearTimeout(timeout);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const spec = await response.json();
    logger.log(`✅ [OpenAPI] Fetched spec from ${source.name} (${source.url})`);
    return spec as Record<string, any>;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    logger.warn(
      `⚠️ [OpenAPI] Failed to fetch spec from ${source.name} (${source.url}): ${message}`,
    );

    if (source.fallbackSpec) {
      logger.log(`📄 [OpenAPI] Using static fallback spec for ${source.name}`);
      return source.fallbackSpec;
    }

    return null;
  }
}

export const getDocsConfig = async (
  app: INestApplication,
  externalSources: ExternalOpenAPISource[] = [],
) => {
  const logger = new Logger('OpenAPI');

  const swaggerConfig = new DocumentBuilder()
    .setTitle('API Gateway for vectix.com')
    .setDescription(MESSAGES.GREETINGS + ' API Gateway - Openapi UI Docs')
    .setVersion('1.0.0')
    .addBearerAuth()
    .build();

  let swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);

  // Fetch and merge external OpenAPI specs
  for (const source of externalSources) {
    const dynamicSpec = await fetchExternalSpec(source, logger);

    // Базою завжди є fallbackSpec, а зверху (якщо доступний) накладається dynamicSpec
    const sourceSpec = dynamicSpec
      ? merge({}, source.fallbackSpec || {}, dynamicSpec)
      : source.fallbackSpec || {};

    // Об'єднуємо отриманий результат у головний swaggerDocument
    swaggerDocument = merge({}, swaggerDocument, {
      paths: sourceSpec.paths || {},
      components: {
        schemas: sourceSpec.components?.schemas || {},
        securitySchemes: sourceSpec.components?.securitySchemes || {},
      },
      tags: [...(swaggerDocument.tags || []), ...(sourceSpec.tags || [])],
    }) as typeof swaggerDocument;
  }

  // // Fetch and merge external OpenAPI specs

  // for (const source of externalSources) {
  //   const externalSpec = await fetchExternalSpec(source, logger);

  //   if (externalSpec) {
  //     // Normalize paths — strip duplicate basePath if present

  //     const normalizedSpec = { ...externalSpec };

  //     // Merge: external spec paths/schemas go INTO the gateway document

  //     swaggerDocument = merge({}, swaggerDocument, {
  //       paths: normalizedSpec.paths || {},

  //       components: {
  //         schemas: normalizedSpec.components?.schemas || {},

  //         securitySchemes: normalizedSpec.components?.securitySchemes || {},
  //       },

  //       tags: [...(swaggerDocument.tags || []), ...(normalizedSpec.tags || [])],
  //     }) as typeof swaggerDocument;
  //   }
  // }

  SwaggerModule.setup('docs/swagger', app, swaggerDocument, {
    jsonDocumentUrl: '/docs/openapi.json',
    yamlDocumentUrl: '/docs/openapi.yaml',
  });

  app.use(
    '/docs/scalar',
    apiReference({
      content: swaggerDocument,
      withFastify: true,
      theme: 'deepSpace',
      hideModels: true,
      layout: 'modern',
    }),
  );
};
