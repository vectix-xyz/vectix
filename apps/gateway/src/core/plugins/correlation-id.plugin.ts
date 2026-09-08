import { METADATA } from '@repo/common/constants';
import { ContextService } from '@repo/infrastructure/context';
import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { customAlphabet } from 'nanoid';

export const CorrelationIdPlugin = async (
  fastify: FastifyInstance,
  contextService: ContextService,
) => {
  fastify.addHook(
    'onRequest',
    (request: FastifyRequest, reply: FastifyReply, done) => {
      const incomingId = request.headers[METADATA.CORRELATION_ID] as string;

      const correlationId = Array.isArray(incomingId)
        ? incomingId[0]
        : incomingId || `req_${customAlphabet('1234567890abcdef', 10)()}`;

      reply.raw.setHeader(METADATA.CORRELATION_ID, correlationId);
      reply.header(METADATA.CORRELATION_ID, correlationId);

      request.headers[METADATA.CORRELATION_ID] = correlationId;

      contextService.run({ correlationId }, () => {
        done();
      });
    },
  );
};
