import { Logger } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { METADATA, REGISTER_PLUGIN_KEYS } from '@repo/common/constants';
import { APIError, type BetterAuthPlugin } from 'better-auth';
import { customAlphabet } from 'nanoid';

export const correlationIdPlugin = (moduleRef: ModuleRef): BetterAuthPlugin => {
  const logger = new Logger('BetterAuth Native');
  return {
    id: REGISTER_PLUGIN_KEYS[0],
    hooks: {
      before: [
        {
          matcher: () => true,
          handler: async context => {
            let correlationId: string | null | undefined = undefined;
            let internalToken: string | undefined = undefined;

            let rawHeaders: Record<string, string> = {};
            if (context.headers instanceof Headers) {
              rawHeaders = Object.fromEntries(context.headers.entries());
            } else if (context.headers) {
              rawHeaders = context.headers as any;
            }

            if (context.headers instanceof Headers) {
              internalToken = context.headers.get(METADATA.INTERNAL_TOKEN) ?? undefined;
            } else if (context.headers && typeof (context.headers as any).get === 'function') {
              internalToken = (context.headers as any).get(METADATA.INTERNAL_TOKEN);
            } else if (context.headers) {
              internalToken = (context.headers as Record<string, string>)[METADATA.INTERNAL_TOKEN];
            }

            if (!internalToken) {
              logger.error(`❌ [InternalSecurity] Token NOT found in headers! Header looked for: ${METADATA.INTERNAL_TOKEN}`);
              throw new APIError('UNAUTHORIZED', {
                message: 'Access denied: Direct access to auth-service is forbidden',
              });
            }

            try {
              const jwtService = moduleRef.get(JwtService, { strict: false });
              const payload = await jwtService.verifyAsync(internalToken);
              logger.log(`✅ [InternalSecurity] Gateway Token Verified! CID: ${payload.cid}`);
            } catch (err: any) {
              logger.error(`❌ [InternalSecurity] JWT Verification Failed! Reason: ${err.message}`);
              logger.error(err.stack);
              throw new APIError('UNAUTHORIZED', {
                message: `Access denied: ${err.message}`,
              });
            }

            if (context.headers) {
              if (typeof (context.headers as any).get === 'function') {
                correlationId = (context.headers as any).get(
                  METADATA.CORRELATION_ID,
                );
              } else if (Array.isArray(context.headers)) {
                const found = context.headers.find(
                  ([key]) => key.toLowerCase() === METADATA.CORRELATION_ID,
                );
                correlationId = found ? found[1] : undefined;
              } else {
                correlationId = (context.headers as Record<string, string>)[
                  METADATA.CORRELATION_ID
                ];
              }
            }

            if (!correlationId) {
              correlationId = `req_${customAlphabet('1234567890abcdef', 10)()}`;

              if (context.headers instanceof Headers) {
                context.headers.set(METADATA.CORRELATION_ID, correlationId);
              }

              if (
                context.headers &&
                typeof (context.headers as any).set === 'function'
              ) {
                (context.headers as any).set(
                  METADATA.CORRELATION_ID,
                  correlationId,
                );
              } else if (context.headers && !Array.isArray(context.headers)) {
                (context.headers as Record<string, string>)[
                  METADATA.CORRELATION_ID
                ] = correlationId;
              }
            }

            const anyContext = context as any;
            if (!anyContext.responseHeaders) {
              anyContext.responseHeaders = new Headers();
            }

            if (anyContext.responseHeaders instanceof Headers) {
              anyContext.responseHeaders.set(
                METADATA.CORRELATION_ID,
                correlationId,
              );
              anyContext.responseHeaders.set(
                METADATA.ACCESS_CONTROL_EXPOSE_HEADERS,
                METADATA.CORRELATION_ID,
              );
            } else {
              anyContext.responseHeaders[METADATA.CORRELATION_ID] =
                correlationId;
            }

            logger.log(`\x1b[45mX-Correlation-ID: ${correlationId}\x1b[0m`);

            return { context };
          },
        },
      ],
    },
  };
};
