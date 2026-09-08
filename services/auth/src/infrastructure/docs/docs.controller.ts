import { Controller, Get, Header, Logger } from '@nestjs/common';
import { authServiceFallbackSpec } from '@repo/common/configs';
import { AUTH_API_PREFIX, METADATA } from '@repo/common/constants';
import { AllowAnonymous, AuthService } from '@thallesp/nestjs-better-auth';

@Controller('docs')
export class DocsController {
  private readonly logger = new Logger(DocsController.name);

  constructor(private readonly authService: AuthService) {}

  @AllowAnonymous()
  @Get('openapi.json')
  @Header(METADATA.CONTENT_TYPE, 'application/json')
  @Header(METADATA.ACCESS_CONTROL_ALLOW_ORIGIN, '*')
  async getOpenApiSchema() {
    try {
      const authInstance = this.authService?.instance as any;
      if (authInstance?.api?.generateOpenAPISchema) {
        const schema = await authInstance.api.generateOpenAPISchema();
        if (schema?.paths) {
          const normalizedPaths: Record<string, any> = {};
          const prefix = AUTH_API_PREFIX;
          for (const [path, item] of Object.entries(schema.paths)) {
            const fullPath = path.startsWith(prefix)
              ? path
              : `${prefix}${path.startsWith('/') ? '' : '/'}${path}`;
            normalizedPaths[fullPath] = item;
          }
          schema.paths = normalizedPaths;
        }
        return schema;
      }
    } catch (error) {
      this.logger.error('Failed to generate BetterAuth OpenAPI schema', error);
    }

    // Fallback if dynamic generation fails
    return authServiceFallbackSpec;
  }
}
