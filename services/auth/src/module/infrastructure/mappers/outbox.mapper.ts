import { OutboxMessage } from '@infrastructure/prisma/client';
import { IOutboxMessage } from '@module/application/ports';
import { OutboxStatus } from '@repo/common/enums';

export class OutboxMapper {
  static toDomain(record: OutboxMessage): IOutboxMessage {
    return {
      id: record.id,
      pattern: record.pattern,
      serviceTarget: record.serviceTarget,
      type: record.type as IOutboxMessage['type'],
      payload: (record.payload as Record<string, any>) ?? {},
      headers: (record.headers as Record<string, any>) ?? null,
      status: record.status as OutboxStatus,
      retryCount: record.retryCount,
      maxRetries: (record as any).maxRetries ?? 3,
			lastError: record.lastError ?? null,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    };
  }
}