import { Logger } from '@nestjs/common';
import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';

export const LoggingPlugin = async (fastify: FastifyInstance) => {
  const logger = new Logger('LOG_PLUGIN');

  // fastify.addHook('onRequest', async (request: FastifyRequest) => {
  //   (request.raw as any).startTime = Date.now();
  // });

  // fastify.addHook(
  //   'preSerialization',
  //   async (request: FastifyRequest, reply: FastifyReply, payload: any) => {
  //     if (reply.statusCode >= 400 && payload) {
  //       (request.raw as any).errorMessageToLog =
  //         payload.message || JSON.stringify(payload);
  //     }
  //     return payload;
  //   },
  // );

  // fastify.addHook(
  //   'onError',
  //   async (request: FastifyRequest, reply: FastifyReply, error: Error) => {
  //     (request.raw as any).errorToLog = error;
  //   },
  // );

  // fastify.addHook(
  //   'onResponse',
  //   async (request: FastifyRequest, reply: FastifyReply) => {
  //     const { method, url } = request;
  //     const { statusCode } = reply;

  //     const startTime = (request.raw as any).startTime;
  //     const delay = startTime ? Date.now() - startTime : 0;
  //     const message = (error?: string) =>
  //       `${statusCode} ${method} ${url} ${delay}ms ${error ? `[ERROR: ${error}]` : ''}`;

  //     if (reply.statusCode >= 400) {
  //       const errorFromPayload = (request.raw as any).errorMessageToLog;
  //       const errorFromHook = (request.raw as any).errorToLog;

  //       const errorMessage =
  //         errorFromPayload ||
  //         (errorFromHook ? errorFromHook.message : 'Unknown Error');

  //       logger.error(message(errorMessage));
  //     } else {
  //       logger.log(message());
  //     }
  //   },
  // );

  fastify.addHook('onRequest', async (request: FastifyRequest) => {
    (request as any).startHrTime = process.hrtime.bigint();
  });

  // onSend перехоплює фінальний payload навіть коли BetterAuth обходить preSerialization
  fastify.addHook(
    'onSend',
    async (request: FastifyRequest, reply: FastifyReply, payload: unknown) => {
      if (reply.statusCode >= 400 && payload) {
        try {
          if (typeof payload === 'string') {
            const parsed = JSON.parse(payload);
            (request as any).errorMessageToLog =
              parsed.message || parsed.error || payload;
          } else if (typeof payload === 'object' && payload !== null) {
            (request as any).errorMessageToLog =
              (payload as any).message ||
              (payload as any).error ||
              JSON.stringify(payload);
          }
        } catch {
          (request as any).errorMessageToLog = String(payload);
        }
      }
      return payload;
    },
  );

  fastify.addHook(
    'onError',
    async (request: FastifyRequest, _reply: FastifyReply, error: Error) => {
      (request as any).errorToLog = error;
    },
  );

  fastify.addHook(
    'onResponse',
    async (request: FastifyRequest, reply: FastifyReply) => {
      const { method, url } = request;
      const { statusCode } = reply;

      const startHrTime = (request as any).startHrTime as bigint | undefined;
      let durationStr = '0ms';

      if (startHrTime) {
        const diffInNs = process.hrtime.bigint() - startHrTime;
        const diffInMs = Number(diffInNs) / 1_000_000;
        // Показує точний час: наприклад, 0.42ms або 12ms
        durationStr =
          diffInMs < 1 ? `${diffInMs.toFixed(2)}ms` : `${Math.round(diffInMs)}ms`;
      }

      if (statusCode >= 400) {
        const errorFromPayload = (request as any).errorMessageToLog;
        const errorFromHook = (request as any).errorToLog;

        const rawErrorMessage =
          errorFromPayload ||
          (errorFromHook ? errorFromHook.message : undefined);

        // Якщо все одно не вдалося розпарсити, беремо стандартний статус або текст
        const errorMessage =
          rawErrorMessage || reply.raw.statusMessage || `HTTP ${statusCode}`;

        logger.error(
          `${statusCode} ${method} ${url} ${durationStr} [ERROR: ${errorMessage}]`,
        );
      } else {
        logger.log(`${statusCode} ${method} ${url} ${durationStr}`);
      }
    },
  );
};
